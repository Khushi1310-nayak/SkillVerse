"""
Skill Wallet Project Management System
A comprehensive system for managing skills, projects, and team collaboration
Integrated with Sustainability Achievements & Gamification
"""

import json
import datetime
import uuid
from typing import Dict, List, Optional, Set, Tuple
from enum import Enum
from dataclasses import dataclass, field
from collections import defaultdict


class SkillLevel(Enum):
    """Skill proficiency levels"""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"
    MASTER = "master"


class SkillCategory(Enum):
    """Categories of skills"""
    TECHNICAL = "technical"
    SOFT = "soft"
    LEADERSHIP = "leadership"
    CREATIVE = "creative"
    ANALYTICAL = "analytical"
    SUSTAINABILITY = "sustainability"
    PROJECT_MANAGEMENT = "project_management"
    COMMUNICATION = "communication"


class ProjectStatus(Enum):
    """Project status states"""
    PLANNING = "planning"
    ACTIVE = "active"
    IN_REVIEW = "in_review"
    COMPLETED = "completed"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class ProjectPriority(Enum):
    """Project priority levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class Skill:
    """Represents a skill in the wallet"""
    skill_id: str
    name: str
    description: str
    category: SkillCategory
    level: SkillLevel
    experience_points: int = 0
    projects_completed: List[str] = field(default_factory=list)
    endorsements: List[str] = field(default_factory=list)  # User IDs
    verified: bool = False
    verified_by: Optional[str] = None
    created_at: datetime.datetime = field(default_factory=datetime.datetime.now)
    last_used: Optional[datetime.datetime] = None
    
    def add_experience(self, points: int) -> bool:
        """Add experience points and potentially level up"""
        self.experience_points += points
        leveled_up = False
        
        # Level up thresholds
        thresholds = {
            SkillLevel.BEGINNER: 100,
            SkillLevel.INTERMEDIATE: 300,
            SkillLevel.ADVANCED: 600,
            SkillLevel.EXPERT: 1000,
            SkillLevel.MASTER: 2000
        }
        
        current_level = self.level
        for level, threshold in thresholds.items():
            if self.experience_points >= threshold and self._get_level_value(level) > self._get_level_value(current_level):
                self.level = level
                leveled_up = True
                break
        
        return leveled_up
    
    def _get_level_value(self, level: SkillLevel) -> int:
        """Get numeric value for skill level"""
        values = {
            SkillLevel.BEGINNER: 0,
            SkillLevel.INTERMEDIATE: 1,
            SkillLevel.ADVANCED: 2,
            SkillLevel.EXPERT: 3,
            SkillLevel.MASTER: 4
        }
        return values.get(level, 0)


@dataclass
class Project:
    """Represents a sustainability project"""
    project_id: str
    name: str
    description: str
    status: ProjectStatus
    priority: ProjectPriority
    owner_id: str
    team_members: List[str] = field(default_factory=list)
    required_skills: List[str] = field(default_factory=list)  # Skill IDs
    sustainability_impact: Dict[str, float] = field(default_factory=dict)
    tasks: List[Dict] = field(default_factory=list)
    milestones: List[Dict] = field(default_factory=list)
    budget: float = 0.0
    start_date: Optional[datetime.datetime] = None
    end_date: Optional[datetime.datetime] = None
    created_at: datetime.datetime = field(default_factory=datetime.datetime.now)
    updated_at: datetime.datetime = field(default_factory=datetime.datetime.now)
    tags: List[str] = field(default_factory=list)
    rating: float = 0.0
    reviews: List[Dict] = field(default_factory=list)
    
    def add_task(self, task: Dict):
        """Add a task to the project"""
        task['task_id'] = str(uuid.uuid4())
        task['created_at'] = datetime.datetime.now().isoformat()
        task['status'] = 'pending'
        self.tasks.append(task)
        self.updated_at = datetime.datetime.now()
    
    def add_milestone(self, milestone: Dict):
        """Add a milestone to the project"""
        milestone['milestone_id'] = str(uuid.uuid4())
        milestone['completed'] = False
        milestone['created_at'] = datetime.datetime.now().isoformat()
        self.milestones.append(milestone)
        self.updated_at = datetime.datetime.now()
    
    def update_status(self, new_status: ProjectStatus):
        """Update project status"""
        self.status = new_status
        self.updated_at = datetime.datetime.now()
    
    def get_progress(self) -> float:
        """Calculate project progress based on tasks"""
        if not self.tasks:
            return 0.0
        
        completed = sum(1 for t in self.tasks if t.get('status') == 'completed')
        return (completed / len(self.tasks)) * 100


@dataclass
class SkillWallet:
    """User's skill wallet containing all skills"""
    user_id: str
    skills: Dict[str, Skill] = field(default_factory=dict)
    total_skill_points: int = 0
    badges: List[str] = field(default_factory=list)
    endorsements_received: int = 0
    projects_contributed: List[str] = field(default_factory=list)
    skill_tree: Dict[str, List[str]] = field(default_factory=dict)  # Prerequisite relationships
    
    def add_skill(self, skill: Skill):
        """Add a skill to the wallet"""
        self.skills[skill.skill_id] = skill
        self.total_skill_points += self._calculate_skill_value(skill)
    
    def remove_skill(self, skill_id: str):
        """Remove a skill from the wallet"""
        if skill_id in self.skills:
            skill = self.skills[skill_id]
            self.total_skill_points -= self._calculate_skill_value(skill)
            del self.skills[skill_id]
    
    def _calculate_skill_value(self, skill: Skill) -> int:
        """Calculate the value of a skill based on level"""
        values = {
            SkillLevel.BEGINNER: 10,
            SkillLevel.INTERMEDIATE: 25,
            SkillLevel.ADVANCED: 50,
            SkillLevel.EXPERT: 100,
            SkillLevel.MASTER: 200
        }
        return values.get(skill.level, 10)
    
    def get_skills_by_category(self, category: SkillCategory) -> List[Skill]:
        """Get all skills in a specific category"""
        return [s for s in self.skills.values() if s.category == category]
    
    def get_skill_level(self, skill_name: str) -> Optional[SkillLevel]:
        """Get the level of a specific skill by name"""
        for skill in self.skills.values():
            if skill.name.lower() == skill_name.lower():
                return skill.level
        return None


class SkillWalletProjectManager:
    """Main system for managing skills, projects, and team collaboration"""
    
    def __init__(self, sustainability_system=None):
        self.skill_wallets: Dict[str, SkillWallet] = {}
        self.projects: Dict[str, Project] = {}
        self.skill_definitions: Dict[str, Skill] = {}
        self.team_assignments: Dict[str, List[str]] = {}  # Project ID -> User IDs
        self.project_invitations: Dict[str, List[Dict]] = {}  # Project ID -> Invitations
        self.sustainability_system = sustainability_system
        self.skill_categories = self._initialize_skill_categories()
        self._initialize_default_skills()
    
    def _initialize_skill_categories(self) -> Dict:
        """Initialize skill categories with descriptions"""
        return {
            SkillCategory.TECHNICAL: {
                "name": "Technical Skills",
                "icon": "🔧",
                "description": "Technical and engineering skills"
            },
            SkillCategory.SOFT: {
                "name": "Soft Skills",
                "icon": "🤝",
                "description": "Interpersonal and communication skills"
            },
            SkillCategory.LEADERSHIP: {
                "name": "Leadership Skills",
                "icon": "👥",
                "description": "Leadership and management skills"
            },
            SkillCategory.CREATIVE: {
                "name": "Creative Skills",
                "icon": "🎨",
                "description": "Creative and design skills"
            },
            SkillCategory.ANALYTICAL: {
                "name": "Analytical Skills",
                "icon": "📊",
                "description": "Analytical and problem-solving skills"
            },
            SkillCategory.SUSTAINABILITY: {
                "name": "Sustainability Skills",
                "icon": "🌱",
                "description": "Sustainability and environmental skills"
            },
            SkillCategory.PROJECT_MANAGEMENT: {
                "name": "Project Management",
                "icon": "📋",
                "description": "Project planning and management skills"
            },
            SkillCategory.COMMUNICATION: {
                "name": "Communication",
                "icon": "💬",
                "description": "Communication and presentation skills"
            }
        }
    
    def _initialize_default_skills(self):
        """Initialize default skill definitions"""
        default_skills = [
            # Technical Skills
            Skill(
                skill_id="skill_001",
                name="Python Programming",
                description="Python development for sustainability applications",
                category=SkillCategory.TECHNICAL,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_002",
                name="Data Analysis",
                description="Data analysis and visualization for sustainability metrics",
                category=SkillCategory.ANALYTICAL,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_003",
                name="Project Planning",
                description="Project planning and resource allocation",
                category=SkillCategory.PROJECT_MANAGEMENT,
                level=SkillLevel.BEGINNER
            ),
            
            # Sustainability Skills
            Skill(
                skill_id="skill_004",
                name="Carbon Footprint Analysis",
                description="Analyzing and reducing carbon footprints",
                category=SkillCategory.SUSTAINABILITY,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_005",
                name="Renewable Energy",
                description="Knowledge of renewable energy systems",
                category=SkillCategory.SUSTAINABILITY,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_006",
                name="Waste Management",
                description="Waste reduction and recycling strategies",
                category=SkillCategory.SUSTAINABILITY,
                level=SkillLevel.BEGINNER
            ),
            
            # Soft Skills
            Skill(
                skill_id="skill_007",
                name="Team Collaboration",
                description="Working effectively in teams",
                category=SkillCategory.SOFT,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_008",
                name="Communication",
                description="Effective communication skills",
                category=SkillCategory.COMMUNICATION,
                level=SkillLevel.BEGINNER
            ),
            
            # Leadership Skills
            Skill(
                skill_id="skill_009",
                name="Team Leadership",
                description="Leading and motivating teams",
                category=SkillCategory.LEADERSHIP,
                level=SkillLevel.BEGINNER
            ),
            Skill(
                skill_id="skill_010",
                name="Strategic Planning",
                description="Strategic planning and vision setting",
                category=SkillCategory.LEADERSHIP,
                level=SkillLevel.BEGINNER
            ),
        ]
        
        for skill in default_skills:
            self.skill_definitions[skill.skill_id] = skill
    
    def create_skill_wallet(self, user_id: str) -> SkillWallet:
        """Create a new skill wallet for a user"""
        if user_id in self.skill_wallets:
            raise ValueError(f"User {user_id} already has a skill wallet")
        
        wallet = SkillWallet(user_id=user_id)
        self.skill_wallets[user_id] = wallet
        return wallet
    
    def get_skill_wallet(self, user_id: str) -> Optional[SkillWallet]:
        """Get a user's skill wallet"""
        return self.skill_wallets.get(user_id)
    
    def award_skill(self, user_id: str, skill_id: str, level: Optional[SkillLevel] = None) -> Dict:
        """Award a skill to a user"""
        if user_id not in self.skill_wallets:
            raise ValueError(f"User {user_id} does not have a skill wallet")
        
        if skill_id not in self.skill_definitions:
            raise ValueError(f"Skill {skill_id} not found")
        
        wallet = self.skill_wallets[user_id]
        skill_def = self.skill_definitions[skill_id]
        
        # Check if user already has the skill
        if skill_id in wallet.skills:
            existing_skill = wallet.skills[skill_id]
            if level and level != existing_skill.level:
                # Upgrade skill
                old_value = wallet._calculate_skill_value(existing_skill)
                existing_skill.level = level
                new_value = wallet._calculate_skill_value(existing_skill)
                wallet.total_skill_points += (new_value - old_value)
                return {
                    "success": True,
                    "action": "upgraded",
                    "skill": skill_def.name,
                    "new_level": level.value
                }
            return {
                "success": False,
                "message": "User already has this skill"
            }
        
        # Create new skill instance
        new_skill = Skill(
            skill_id=skill_id,
            name=skill_def.name,
            description=skill_def.description,
            category=skill_def.category,
            level=level or SkillLevel.BEGINNER
        )
        
        wallet.add_skill(new_skill)
        
        # Award sustainability points if integrated
        if self.sustainability_system:
            points_earned = wallet._calculate_skill_value(new_skill) // 2
            user = self.sustainability_system.get_user(user_id)
            if user:
                user.total_points += points_earned
                user.add_xp(points_earned // 2)
        
        return {
            "success": True,
            "action": "awarded",
            "skill": new_skill.name,
            "level": new_skill.level.value,
            "skill_points": wallet._calculate_skill_value(new_skill)
        }
    
    def create_project(self, 
                       name: str,
                       description: str,
                       owner_id: str,
                       priority: ProjectPriority = ProjectPriority.MEDIUM,
                       required_skills: List[str] = None,
                       budget: float = 0.0,
                       tags: List[str] = None) -> Project:
        """Create a new project"""
        if required_skills is None:
            required_skills = []
        if tags is None:
            tags = []
        
        project_id = str(uuid.uuid4())
        project = Project(
            project_id=project_id,
            name=name,
            description=description,
            status=ProjectStatus.PLANNING,
            priority=priority,
            owner_id=owner_id,
            required_skills=required_skills,
            budget=budget,
            tags=tags,
            start_date=datetime.datetime.now(),
            team_members=[owner_id]
        )
        
        self.projects[project_id] = project
        self.team_assignments[project_id] = [owner_id]
        self.project_invitations[project_id] = []
        
        # Add to user's contributed projects
        if owner_id in self.skill_wallets:
            wallet = self.skill_wallets[owner_id]
            wallet.projects_contributed.append(project_id)
        
        return project
    
    def invite_to_project(self, project_id: str, inviter_id: str, invitee_id: str) -> Dict:
        """Invite a user to join a project"""
        if project_id not in self.projects:
            return {"success": False, "message": "Project not found"}
        
        project = self.projects[project_id]
        if inviter_id != project.owner_id and inviter_id not in project.team_members:
            return {"success": False, "message": "Only project members can invite others"}
        
        if invitee_id in project.team_members:
            return {"success": False, "message": "User is already a team member"}
        
        # Check if already invited
        for invitation in self.project_invitations[project_id]:
            if invitation['user_id'] == invitee_id and not invitation['responded']:
                return {"success": False, "message": "User already invited"}
        
        # Create invitation
        invitation = {
            "invitation_id": str(uuid.uuid4()),
            "project_id": project_id,
            "project_name": project.name,
            "inviter_id": inviter_id,
            "user_id": invitee_id,
            "invited_at": datetime.datetime.now().isoformat(),
            "responded": False,
            "accepted": False
        }
        
        self.project_invitations[project_id].append(invitation)
        
        return {
            "success": True,
            "message": f"Invitation sent to user {invitee_id}",
            "invitation": invitation
        }
    
    def respond_to_invitation(self, project_id: str, user_id: str, accept: bool) -> Dict:
        """Respond to a project invitation"""
        if project_id not in self.project_invitations:
            return {"success": False, "message": "No invitations found for this project"}
        
        for invitation in self.project_invitations[project_id]:
            if invitation['user_id'] == user_id and not invitation['responded']:
                invitation['responded'] = True
                invitation['accepted'] = accept
                
                if accept:
                    # Add user to team
                    project = self.projects[project_id]
                    project.team_members.append(user_id)
                    self.team_assignments[project_id].append(user_id)
                    
                    # Add to user's contributed projects
                    if user_id in self.skill_wallets:
                        wallet = self.skill_wallets[user_id]
                        wallet.projects_contributed.append(project_id)
                    
                    return {
                        "success": True,
                        "message": f"User {user_id} joined the project",
                        "accepted": True
                    }
                else:
                    return {
                        "success": True,
                        "message": f"User {user_id} declined the invitation",
                        "accepted": False
                    }
        
        return {"success": False, "message": "No pending invitation found"}
    
    def assign_task(self, project_id: str, task: Dict) -> Dict:
        """Assign a task to a team member"""
        if project_id not in self.projects:
            return {"success": False, "message": "Project not found"}
        
        project = self.projects[project_id]
        
        # Verify assignee is on the team
        assignee = task.get('assignee_id')
        if assignee and assignee not in project.team_members:
            return {"success": False, "message": "Assignee is not on the project team"}
        
        project.add_task(task)
        
        return {
            "success": True,
            "message": "Task added successfully",
            "task_id": task['task_id']
        }
    
    def complete_task(self, project_id: str, task_id: str, user_id: str) -> Dict:
        """Mark a task as complete and award skill points"""
        if project_id not in self.projects:
            return {"success": False, "message": "Project not found"}
        
        project = self.projects[project_id]
        
        # Find the task
        task = next((t for t in project.tasks if t.get('task_id') == task_id), None)
        if not task:
            return {"success": False, "message": "Task not found"}
        
        # Verify user is assigned to the task
        if task.get('assignee_id') != user_id:
            return {"success": False, "message": "User is not assigned to this task"}
        
        # Complete the task
        task['status'] = 'completed'
        task['completed_at'] = datetime.datetime.now().isoformat()
        project.updated_at = datetime.datetime.now()
        
        # Award skill points
        skill_points_earned = 0
        if user_id in self.skill_wallets:
            wallet = self.skill_wallets[user_id]
            
            # Award points based on task complexity
            complexity = task.get('complexity', 1)
            points = 10 * complexity
            skill_points_earned = points
            
            # Award to relevant skills
            skill_ids = task.get('skill_ids', [])
            if skill_ids:
                for skill_id in skill_ids:
                    if skill_id in wallet.skills:
                        skill = wallet.skills[skill_id]
                        leveled_up = skill.add_experience(points)
                        if leveled_up:
                            # Update total skill points
                            wallet.total_skill_points += wallet._calculate_skill_value(skill)
        
        # Also award sustainability points if integrated
        if self.sustainability_system and user_id:
            user = self.sustainability_system.get_user(user_id)
            if user:
                bonus_points = skill_points_earned // 2
                user.total_points += bonus_points
                user.add_xp(bonus_points // 2)
        
        # Check if all tasks completed
        all_completed = all(t.get('status') == 'completed' for t in project.tasks)
        if all_completed and project.status != ProjectStatus.COMPLETED:
            project.update_status(ProjectStatus.COMPLETED)
            
            # Award project completion bonus
            self._award_project_completion_bonus(project_id)
        
        return {
            "success": True,
            "message": "Task completed successfully",
            "skill_points_earned": skill_points_earned,
            "project_progress": project.get_progress()
        }
    
    def _award_project_completion_bonus(self, project_id: str):
        """Award bonus points for project completion"""
        project = self.projects[project_id]
        
        for member_id in project.team_members:
            if member_id in self.skill_wallets:
                wallet = self.skill_wallets[member_id]
                
                # Award bonus skill points
                bonus_points = 50
                wallet.total_skill_points += bonus_points
                
                # Award sustainability points
                if self.sustainability_system:
                    user = self.sustainability_system.get_user(member_id)
                    if user:
                        user.total_points += bonus_points
                        user.add_xp(bonus_points // 2)
    
    def get_project_team_skills(self, project_id: str) -> Dict:
        """Get aggregated skills of all team members"""
        if project_id not in self.projects:
            return {}
        
        project = self.projects[project_id]
        team_skills = defaultdict(lambda: {
            "count": 0,
            "levels": defaultdict(int),
            "members": []
        })
        
        for member_id in project.team_members:
            if member_id in self.skill_wallets:
                wallet = self.skill_wallets[member_id]
                for skill in wallet.skills.values():
                    team_skills[skill.name]["count"] += 1
                    team_skills[skill.name]["levels"][skill.level.value] += 1
                    team_skills[skill.name]["members"].append(member_id)
        
        return dict(team_skills)
    
    def match_skills_to_project(self, project_id: str) -> List[Dict]:
        """Find users with skills matching project requirements"""
        if project_id not in self.projects:
            return []
        
        project = self.projects[project_id]
        if not project.required_skills:
            return []
        
        matches = []
        required_skill_ids = set(project.required_skills)
        
        for user_id, wallet in self.skill_wallets.items():
            if user_id in project.team_members:
                continue  # Skip current team members
            
            user_skills = set(wallet.skills.keys())
            matching_skills = required_skill_ids.intersection(user_skills)
            
            if matching_skills:
                matches.append({
                    "user_id": user_id,
                    "matching_skills": list(matching_skills),
                    "match_score": len(matching_skills) / len(required_skill_ids),
                    "total_skills": len(wallet.skills),
                    "skill_points": wallet.total_skill_points
                })
        
        # Sort by match score
        matches.sort(key=lambda x: x['match_score'], reverse=True)
        return matches
    
    def get_project_analytics(self, project_id: str) -> Dict:
        """Get comprehensive analytics for a project"""
        if project_id not in self.projects:
            return {}
        
        project = self.projects[project_id]
        
        # Task analytics
        total_tasks = len(project.tasks)
        completed_tasks = sum(1 for t in project.tasks if t.get('status') == 'completed')
        pending_tasks = total_tasks - completed_tasks
        
        # Team analytics
        team_size = len(project.team_members)
        team_skills = self.get_project_team_skills(project_id)
        
        # Skill gaps
        required_skill_names = []
        for skill_id in project.required_skills:
            if skill_id in self.skill_definitions:
                required_skill_names.append(self.skill_definitions[skill_id].name)
        
        # Progress over time (simplified)
        progress_data = []
        if project.milestones:
            for milestone in project.milestones:
                progress_data.append({
                    "name": milestone.get('name', ''),
                    "completed": milestone.get('completed', False),
                    "due_date": milestone.get('due_date', None)
                })
        
        return {
            "project_name": project.name,
            "status": project.status.value,
            "priority": project.priority.value,
            "progress": project.get_progress(),
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "pending_tasks": pending_tasks,
            "team_size": team_size,
            "team_skills": team_skills,
            "required_skills": required_skill_names,
            "milestones": progress_data,
            "days_active": (datetime.datetime.now() - project.created_at).days,
            "budget_used": project.budget,  # Simplified
            "rating": project.rating,
            "reviews_count": len(project.reviews)
        }
    
    def add_project_review(self, project_id: str, user_id: str, rating: float, comment: str = "") -> Dict:
        """Add a review to a project"""
        if project_id not in self.projects:
            return {"success": False, "message": "Project not found"}
        
        project = self.projects[project_id]
        
        if user_id not in project.team_members:
            return {"success": False, "message": "Only team members can review projects"}
        
        review = {
            "review_id": str(uuid.uuid4()),
            "user_id": user_id,
            "rating": rating,
            "comment": comment,
            "created_at": datetime.datetime.now().isoformat()
        }
        
        project.reviews.append(review)
        
        # Update average rating
        total_ratings = sum(r['rating'] for r in project.reviews)
        project.rating = total_ratings / len(project.reviews)
        
        return {
            "success": True,
            "message": "Review added successfully",
            "new_rating": project.rating
        }
    
    def get_skill_recommendations(self, user_id: str, project_id: Optional[str] = None) -> List[Dict]:
        """Get skill recommendations for a user"""
        if user_id not in self.skill_wallets:
            return []
        
        wallet = self.skill_wallets[user_id]
        user_skill_ids = set(wallet.skills.keys())
        
        recommendations = []
        
        # If project provided, recommend skills needed for the project
        if project_id and project_id in self.projects:
            project = self.projects[project_id]
            needed_skills = set(project.required_skills) - user_skill_ids
            
            for skill_id in needed_skills:
                if skill_id in self.skill_definitions:
                    skill = self.skill_definitions[skill_id]
                    recommendations.append({
                        "skill_id": skill_id,
                        "skill_name": skill.name,
                        "category": skill.category.value,
                        "reason": f"Needed for project: {project.name}",
                        "priority": "high"
                    })
        
        # Recommend skills in same category as user's existing skills
        user_categories = set()
        for skill in wallet.skills.values():
            user_categories.add(skill.category)
        
        for skill_id, skill in self.skill_definitions.items():
            if skill_id not in user_skill_ids:
                if skill.category in user_categories:
                    recommendations.append({
                        "skill_id": skill_id,
                        "skill_name": skill.name,
                        "category": skill.category.value,
                        "reason": "Related to your existing skills",
                        "priority": "medium"
                    })
        
        # Limit recommendations
        return recommendations[:10]
    
    def export_wallet_data(self, user_id: str) -> Dict:
        """Export a user's complete skill wallet data"""
        if user_id not in self.skill_wallets:
            return {}
        
        wallet = self.skill_wallets[user_id]
        
        return {
            "user_id": user_id,
            "total_skill_points": wallet.total_skill_points,
            "skills": [
                {
                    "name": skill.name,
                    "category": skill.category.value,
                    "level": skill.level.value,
                    "experience_points": skill.experience_points,
                    "projects_completed": len(skill.projects_completed),
                    "endorsements": len(skill.endorsements),
                    "verified": skill.verified
                }
                for skill in wallet.skills.values()
            ],
            "badges": wallet.badges,
            "endorsements_received": wallet.endorsements_received,
            "projects_contributed": len(wallet.projects_contributed),
            "skill_tree": wallet.skill_tree
        }


# Integration with Sustainability Gamification
class IntegratedSustainabilityManager:
    """Combines Sustainability Gamification with Skill Wallet Project Management"""
    
    def __init__(self):
        self.sustainability = SustainabilityGamification()
        self.project_manager = SkillWalletProjectManager(self.sustainability)
        
        # Auto-create skill wallets for sustainability users
        self._sync_users()
    
    def _sync_users(self):
        """Sync users between systems"""
        for user_id in self.sustainability.users:
            if user_id not in self.project_manager.skill_wallets:
                self.project_manager.create_skill_wallet(user_id)
    
    def register_user(self, user_id: str, username: str) -> Dict:
        """Register a user in both systems"""
        # Register in sustainability system
        user = self.sustainability.register_user(user_id, username)
        
        # Create skill wallet
        wallet = self.project_manager.create_skill_wallet(user_id)
        
        # Award initial skills based on activity
        self._award_initial_skills(user_id)
        
        return {
            "user": user,
            "wallet": wallet,
            "message": f"User {username} registered successfully"
        }
    
    def _award_initial_skills(self, user_id: str):
        """Award initial skills to a new user"""
        initial_skills = ["skill_007", "skill_008"]  # Team Collaboration, Communication
        for skill_id in initial_skills:
            self.project_manager.award_skill(user_id, skill_id, SkillLevel.BEGINNER)
    
    def complete_sustainable_action_with_skill(self, user_id: str, action_id: str, quantity: int = 1) -> Dict:
        """Complete a sustainable action and also earn skill points"""
        # Complete the action in sustainability system
        result = self.sustainability.complete_action(user_id, action_id, quantity)
        
        if result["success"]:
            # Award skill points based on the action
            action = self.sustainability.actions.get(action_id)
            if action and user_id in self.project_manager.skill_wallets:
                wallet = self.project_manager.skill_wallets[user_id]
                
                # Map action category to skill category
                category_mapping = {
                    ActionCategory.ENERGY: SkillCategory.SUSTAINABILITY,
                    ActionCategory.WATER: SkillCategory.SUSTAINABILITY,
                    ActionCategory.WASTE: SkillCategory.SUSTAINABILITY,
                    ActionCategory.TRANSPORT: SkillCategory.TECHNICAL,
                    ActionCategory.FOOD: SkillCategory.SUSTAINABILITY,
                    ActionCategory.SHOPPING: SkillCategory.CREATIVE,
                    ActionCategory.COMMUNITY: SkillCategory.SOFT
                }
                
                skill_category = category_mapping.get(action.category, SkillCategory.SUSTAINABILITY)
                
                # Find or create a skill in this category
                skill_found = False
                for skill in wallet.skills.values():
                    if skill.category == skill_category:
                        skill.add_experience(quantity * 5)
                        skill_found = True
                        break
                
                # Update wallet total points
                wallet.total_skill_points += quantity * 5
        
        return result
    
    def create_sustainability_project(self, 
                                     name: str,
                                     description: str,
                                     owner_id: str,
                                     sustainability_goals: Dict[str, float],
                                     required_skills: List[str] = None) -> Project:
        """Create a sustainability-focused project"""
        project = self.project_manager.create_project(
            name=name,
            description=description,
            owner_id=owner_id,
            priority=ProjectPriority.HIGH,
            required_skills=required_skills,
            tags=["sustainability", "environmental"]
        )
        
        # Add sustainability impact metrics
        project.sustainability_impact = sustainability_goals
        
        return project
    
    def get_user_dashboard(self, user_id: str) -> Dict:
        """Get comprehensive dashboard for a user"""
        dashboard = {
            "sustainability_stats": {},
            "skill_wallet": {},
            "projects": [],
            "achievements": []
        }
        
        # Get sustainability stats
        if user_id in self.sustainability.users:
            dashboard["sustainability_stats"] = self.sustainability.get_user_stats(user_id)
        
        # Get skill wallet
        if user_id in self.project_manager.skill_wallets:
            wallet = self.project_manager.skill_wallets[user_id]
            dashboard["skill_wallet"] = {
                "total_skill_points": wallet.total_skill_points,
                "skills_count": len(wallet.skills),
                "skills": [
                    {
                        "name": s.name,
                        "level": s.level.value,
                        "category": s.category.value
                    }
                    for s in wallet.skills.values()
                ]
            }
        
        # Get projects
        dashboard["projects"] = []
        for project_id, project in self.project_manager.projects.items():
            if user_id in project.team_members:
                dashboard["projects"].append({
                    "name": project.name,
                    "status": project.status.value,
                    "progress": project.get_progress(),
                    "role": "Owner" if project.owner_id == user_id else "Member"
                })
        
        # Get achievements (from sustainability system)
        if user_id in self.sustainability.users:
            user = self.sustainability.users[user_id]
            dashboard["achievements"] = [
                {
                    "name": self.sustainability.achievements[ach_id].name,
                    "tier": self.sustainability.achievements[ach_id].tier.value
                }
                for ach_id in user.achievements
                if ach_id in self.sustainability.achievements
            ]
        
        return dashboard


# Example usage and demonstration
def demo_integrated_system():
    """Demonstrate the integrated sustainability and skill wallet system"""
    print("🌍 INTEGRATED SUSTAINABILITY & SKILL WALLET SYSTEM 🌍")
    print("=" * 80)
    
    # Initialize integrated system
    system = IntegratedSustainabilityManager()
    
    # Register users
    print("\n📝 Registering users...")
    alice = system.register_user("user_001", "EcoAlice")
    bob = system.register_user("user_002", "GreenBob")
    charlie = system.register_user("user_003", "SustainableCharlie")
    
    print(f"✅ Registered: {alice['user'].username}, {bob['user'].username}, {charlie['user'].username}")
    
    # Award some skills
    print("\n🎯 Awarding skills...")
    system.project_manager.award_skill("user_001", "skill_001", SkillLevel.INTERMEDIATE)  # Python
    system.project_manager.award_skill("user_001", "skill_004", SkillLevel.ADVANCED)     # Carbon Footprint
    system.project_manager.award_skill("user_002", "skill_005", SkillLevel.INTERMEDIATE) # Renewable Energy
    system.project_manager.award_skill("user_002", "skill_009", SkillLevel.INTERMEDIATE) # Team Leadership
    system.project_manager.award_skill("user_003", "skill_006", SkillLevel.INTERMEDIATE) # Waste Management
    
    print("✅ Skills awarded successfully")
    
    # Complete sustainable actions that also earn skill points
    print("\n🌱 Completing sustainable actions with skill integration...")
    actions = [
        ("walk_bike", 2),
        ("recycle", 3),
        ("reduce_energy", 2),
        ("meatless_meal", 1)
    ]
    
    for action_id, quantity in actions:
        result = system.complete_sustainable_action_with_skill("user_001", action_id, quantity)
        if result["success"]:
            print(f"  ✅ EcoAlice: {result['action']} → {result['points_earned']} points + skill points")
    
    # Create a sustainability project
    print("\n📋 Creating sustainability project...")
    project = system.create_sustainability_project(
        name="Community Solar Initiative",
        description="Install solar panels at the community center",
        owner_id="user_002",
        sustainability_goals={
            "co2_reduction": 5000,  # kg
            "energy_generation": 10000,  # kWh
            "community_benefit": 100  # households
        },
        required_skills=["skill_001", "skill_004", "skill_005"]
    )
    
    print(f"✅ Project created: {project.name} (ID: {project.project_id})")
    
    # Invite team members
    print("\n👥 Inviting team members...")
    invite_result = system.project_manager.invite_to_project(
        project.project_id,
        "user_002",  # inviter
        "user_001"   # invitee
    )
    
    if invite_result["success"]:
        print(f"  ✅ {invite_result['message']}")
    
    # Respond to invitation
    response = system.project_manager.respond_to_invitation(
        project.project_id,
        "user_001",
        accept=True
    )
    print(f"  ✅ {response['message']}")
    
    # Add tasks to the project
    print("\n📝 Adding tasks to project...")
    tasks = [
        {
            "name": "Site Assessment",
            "description": "Evaluate the community center for solar panel installation",
            "assignee_id": "user_001",
            "complexity": 3,
            "skill_ids": ["skill_001", "skill_004"]
        },
        {
            "name": "Solar Panel Design",
            "description": "Design the solar panel layout",
            "assignee_id": "user_002",
            "complexity": 4,
            "skill_ids": ["skill_005"]
        },
        {
            "name": "Community Outreach",
            "description": "Inform community members about the project",
            "assignee_id": "user_003",
            "complexity": 2,
            "skill_ids": ["skill_008"]
        }
    ]
    
    for task in tasks:
        result = system.project_manager.assign_task(project.project_id, task)
        if result["success"]:
            print(f"  ✅ Task added: {task['name']}")
    
    # Complete tasks
    print("\n✅ Completing tasks...")
    task_results = []
    for task in project.tasks:
        result = system.project_manager.complete_task(
            project.project_id,
            task['task_id'],
            task['assignee_id']
        )
        if result["success"]:
            task_results.append(result)
            print(f"  ✅ Task completed: {task['name']} (Skill points: {result['skill_points_earned']})")
    
    # Project analytics
    print("\n📊 Project Analytics")
    print("-" * 60)
    analytics = system.project_manager.get_project_analytics(project.project_id)
    print(f"  Project: {analytics['project_name']}")
    print(f"  Status: {analytics['status']}")
    print(f"  Progress: {analytics['progress']:.1f}%")
    print(f"  Team Size: {analytics['team_size']}")
    print(f"  Tasks: {analytics['completed_tasks']}/{analytics['total_tasks']} completed")
    
    # Team skills analysis
    print("\n🔧 Team Skills Analysis")
    print("-" * 60)
    team_skills = system.project_manager.get_project_team_skills(project.project_id)
    for skill_name, data in list(team_skills.items())[:5]:
        print(f"  {skill_name}: {data['count']} members, Levels: {dict(data['levels'])}")
    
    # Skill matching
    print("\n🎯 Skill Matching for Project")
    print("-" * 60)
    matches = system.project_manager.match_skills_to_project(project.project_id)
    for match in matches[:3]:
        print(f"  User {match['user_id']}: {match['match_score']*100:.0f}% match ({len(match['matching_skills'])} skills)")
    
    # User dashboard
    print("\n👤 User Dashboard - EcoAlice")
    print("-" * 60)
    dashboard = system.get_user_dashboard("user_001")
    
    print(f"  Sustainability Points: {dashboard['sustainability_stats'].get('total_points', 0)}")
    print(f"  Skill Points: {dashboard['skill_wallet'].get('total_skill_points', 0)}")
    print(f"  Skills: {len(dashboard['skill_wallet'].get('skills', []))}")
    print(f"  Projects: {len(dashboard['projects'])}")
    print(f"  Achievements: {len(dashboard['achievements'])}")
    
    # Export wallet data
    print("\n💾 Exporting skill wallet...")
    wallet_data = system.project_manager.export_wallet_data("user_001")
    print(f"  Total Skill Points: {wallet_data['total_skill_points']}")
    print(f"  Skills: {len(wallet_data['skills'])}")
    for skill in wallet_data['skills'][:3]:
        print(f"    - {skill['name']} ({skill['level']})")
    
    # Save all data
    print("\n💾 Saving all data...")
    system.sustainability.save_data("integrated_data.json")
    
    print("\n✨ Integrated system demonstration complete! ✨")


if __name__ == "__main__":
    demo_integrated_system()
