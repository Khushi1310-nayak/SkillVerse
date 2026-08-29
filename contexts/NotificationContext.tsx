import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuthContext } from './AuthContext';
import { AppNotification } from '../types';

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    useEffect(() => {
        if (!user) {
            setNotifications([]);
            return;
        }

        const q = query(
            collection(db, 'users', user.uid, 'notifications'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items: AppNotification[] = [];
                snapshot.forEach((docSnap) => {
                    items.push({ id: docSnap.id, ...docSnap.data() } as AppNotification);
                });
                setNotifications(items);
            },
            (error) => {
                // Non-blocking background sync; fail gracefully if permissions not yet deployed
                console.warn('Notifications background sync deferred:', error?.message || error);
                setNotifications([]);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (notificationId: string) => {
        if (!user) return;
        try {
            const docRef = doc(db, 'users', user.uid, 'notifications', notificationId);
            await updateDoc(docRef, { read: true });
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!user) return;
        const unread = notifications.filter(n => !n.read);
        if (unread.length === 0) return;
        try {
            const batch = writeBatch(db);
            unread.forEach(n => {
                batch.update(doc(db, 'users', user.uid, 'notifications', n.id), { read: true });
            });
            await batch.commit();
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotificationContext must be used within a NotificationProvider');
    return context;
};