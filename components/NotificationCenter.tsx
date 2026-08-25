import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, UserPlus, MessageSquare, Pin } from 'lucide-react';
import { useNotificationContext } from '../contexts/NotificationContext';
import { AppNotification } from '../types';

const NOTIFICATION_ICONS: Record<AppNotification['type'], React.ElementType> = {
    follow: UserPlus,
    comment_reply: MessageSquare,
    comment_pinned: Pin,
};

const formatTimestamp = (iso: string): string => {
    const date = new Date(iso);
    const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
};

export const NotificationCenter: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationContext();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.read) markAsRead(notification.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className="relative p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight"
            >
                <Bell size={20} className="text-textMain" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label="Notifications"
                    className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-[#0B1220] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
                        <h3 className="font-bold text-textMain text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="flex items-center gap-1 text-xs font-semibold text-primaryLight hover:underline"
                            >
                                <CheckCheck size={14} /> Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-textMuted">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map(notification => {
                                const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                                const content = (
                                    <div
                                        className={`flex items-start gap-3 px-4 py-3 border-b border-black/5 dark:border-white/5 last:border-0 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${!notification.read ? 'bg-primary/5' : ''
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Icon size={14} className="text-primaryLight" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-textMain leading-snug">{notification.message}</p>
                                            <p className="text-[11px] text-textMuted mt-1">{formatTimestamp(notification.createdAt)}</p>
                                        </div>
                                        {!notification.read && (
                                            <span className="w-2 h-2 rounded-full bg-primaryLight shrink-0 mt-1.5" aria-hidden="true" />
                                        )}
                                    </div>
                                );

                                return notification.link ? (
                                    <Link
                                        key={notification.id}
                                        to={notification.link}
                                        role="menuitem"
                                        onClick={() => handleNotificationClick(notification)}
                                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-inset"
                                    >
                                        {content}
                                    </Link>
                                ) : (
                                    <button
                                        key={notification.id}
                                        role="menuitem"
                                        onClick={() => handleNotificationClick(notification)}
                                        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-inset"
                                    >
                                        {content}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};