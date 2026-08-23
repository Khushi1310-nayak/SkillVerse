"""
Skill Wallet Achievement System
A gamified platform for tracking, verifying, and showcasing skills and achievements
"""

import json
import datetime
import hashlib
import uuid
from typing import Dict, List, Optional, Set, Tuple
from enum import Enum
from dataclasses import dataclass, asdict
import random
import time

# ==================== Core Data Structures ====================

@dataclass
class Skill:
    """Represents a skill with metadata"""
    id: str
    name: str
    category: str
    level: int  # 1-5 (Beginner to Expert)
    experience_points: int
    milestones: List[str]
    verified_by: Optional[str] = None
    verification_date: Optional[datetime.datetime] = None
    proof_links: List[str] = None
    
    def __post_init__(self):
        if self.proof_links is None:
            self.proof_links = []
    
    def to_dict(self):
        return asdict(self)

@dataclass
class Achievement:
    """Represents an achievement or badge"""
    id: str
    name: str
    description: str
    category: str
    rarity: str  # Common, Uncommon, Rare, Epic, Legendary
    points: int
    unlocked: bool = False
    unlocked_date: Optional[datetime.datetime] = None
    criteria: Dict = None
    
    def __post_init__(self):
        if self.criteria is None:
            self.criteria = {}

@dataclass
class LearningPath:
    """Represents a structured learning path"""
    id: str
    name: str
    description: str
    skills_required: List[str]
    skills_acquired: List[str]
    progress: float  # 0-1
    start_date: datetime.datetime
    estimated_completion: Optional[datetime.datetime] = None
    current_stage: int = 0
    stages: List[Dict] = None
    
    def __post_init__(self):
        if self.stages is None:
            self.stages = []

@dataclass
class VerificationRequest:
    """Represents a skill verification request"""
    id: str
    skill_id: str
    requester_id: str
    verifier_id: Optional[str] = None
    status: str = "pending"  # pending, approved, rejected
    submitted_date: datetime.datetime = None
    review_date: Optional[datetime.datetime] = None
    comments: List[Dict] = None
    evidence: List[str] = None
    
    def __post_init__(self):
        if self.submitted_date is None:
            self.submitted_date = datetime.datetime.now()
        if self.comments is None:
            self.comments = []
        if self.evidence is None:
            self.evidence = []

class SkillLevel(Enum):
    """Skill level enumeration"""
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4
    MASTER = 5

class AchievementRarity(Enum):
    """Achievement rarity levels"""
    COMMON = "Common"
    UNCOMMON = "Uncommon"
    RARE = "Rare"
    EPIC = "Epic"
    LEGENDARY = "Legendary"

# ==================== Skill Wallet Core ====================

class SkillWallet:
    """Main skill wallet system"""
    
    def __init__(self, user_id: str, user_name: str):
        self.user_id = user_id
        self.user_name = user_name
        self.skills: Dict[str, Skill] = {}
        self.achievements: Dict[str, Achievement] = {}
        self.learning_paths: Dict[str, LearningPath] = {}
        self.verification_requests: Dict[str, VerificationRequest] = {}
        self.total_points = 0
        self.level = 1
        self.experience = 0
        self.created_date = datetime.datetime.now()
        self.last_updated = datetime.datetime.now()
        self.tags: Set[str] = set()
        self.blockchain_hash = self._generate_hash()
        
        # Initialize with default achievements
        self._initialize_default_achievements()
    
    def _generate_hash(self) -> str:
        """Generate unique hash for wallet integrity"""
        data = f"{self.user_id}{self.created_date}{random.random()}"
        return hashlib.sha256(data.encode()).hexdigest()[:16]
    
    def _initialize_default_achievements(self):
        """Initialize default achievements"""
        default_achievements = [
            Achievement(
                id="first_skill",
                name="First Skill",
                description="Added your first skill to the wallet",
                category="Learning",
                rarity=AchievementRarity.COMMON.value,
                points=10
            ),
            Achievement(
                id="skill_collector",
                name="Skill Collector",
                description="Collected 5 skills",
                category="Learning",
                rarity=AchievementRarity.UNCOMMON.value,
                points=25,
                criteria={"min_skills": 5}
            ),
            Achievement(
                id="master_learner",
                name="Master Learner",
                description="Reached level 5 in any skill",
                category="Mastery",
                rarity=AchievementRarity.RARE.value,
                points=50
            ),
            Achievement(
                id="learning_path_complete",
                name="Learning Path Complete",
                description="Completed a learning path",
                category="Growth",
                rarity=AchievementRarity.EPIC.value,
                points=100
            ),
            Achievement(
                id="verification_master",
                name="Verification Master",
                description="Got 10 skills verified",
                category="Trust",
                rarity=AchievementRarity.RARE.value,
                points=75
            ),
            Achievement(
                id="diverse_learner",
                name="Diverse Learner",
                description="Have skills in 5 different categories",
                category="Versatility",
                rarity=AchievementRarity.EPIC.value,
                points=150
            ),
            Achievement(
                id="legendary_learner",
                name="Legendary Learner",
                description="Reach overall level 10",
                category="Mastery",
                rarity=AchievementRarity.LEGENDARY.value,
                points=500
            )
        ]
        
        for achievement in default_achievements:
            self.achievements[achievement.id] = achievement
    
    # ==================== Skill Management ====================
    
    def add_skill(self, name: str, category: str, level: int = 1,
                  proof_links: List[str] = None) -> Skill:
        """Add a new skill to the wallet"""
        skill_id = f"skill_{uuid.uuid4().hex[:8]}"
        skill = Skill(
            id=skill_id,
            name=name,
            category=category,
            level=level,
            experience_points=0,
            milestones=[],
            proof_links=proof_links or []
        )
        
        self.skills[skill_id] = skill
        self.tags.add(category)
        self._update_experience(5)  # Basic XP for adding a skill
        self._check_achievements()
        self.last_updated = datetime.datetime.now()
        
        return skill
    
    def update_skill_level(self, skill_id: str, new_level: int, 
                          proof: str = None) -> bool:
        """Update skill level with verification"""
        if skill_id not in self.skills:
            return False
        
        skill = self.skills[skill_id]
        if new_level <= skill.level:
            return False
        
        if new_level > 5:
            new_level = 5
        
        # Update skill
        old_level = skill.level
        skill.level = new_level
        if proof:
            skill.proof_links.append(proof)
        skill.milestones.append(f"Achieved level {new_level} on {datetime.datetime.now()}")
        
        # Award XP based on level increase
        xp_gain = (new_level - old_level) * 20
        self._update_experience(xp_gain)
        
        # Check for mastery achievement
        if new_level == 5:
            self._unlock_achievement("master_learner")
        
        self.last_updated = datetime.datetime.now()
        return True
    
    def get_skill_by_id(self, skill_id: str) -> Optional[Skill]:
        """Get skill by ID"""
        return self.skills.get(skill_id)
    
    def get_skills_by_category(self, category: str) -> List[Skill]:
        """Get all skills in a category"""
        return [s for s in self.skills.values() if s.category == category]
    
    def get_skills_by_level(self, level: int) -> List[Skill]:
        """Get all skills at a specific level"""
        return [s for s in self.skills.values() if s.level == level]
    
    def get_skill_summary(self) -> Dict:
        """Get summary of all skills"""
        categories = {}
        for skill in self.skills.values():
            if skill.category not in categories:
                categories[skill.category] = {
                    "count": 0,
                    "avg_level": 0,
                    "total_xp": 0
                }
            categories[skill.category]["count"] += 1
            categories[skill.category]["total_xp"] += skill.experience_points
        
        for cat in categories:
            if categories[cat]["count"] > 0:
                categories[cat]["avg_level"] = (
                    sum(s.level for s in self.skills.values() 
                        if s.category == cat) / categories[cat]["count"]
                )
        
        return {
            "total_skills": len(self.skills),
            "categories": categories,
            "avg_level": sum(s.level for s in self.skills.values()) / len(self.skills) if self.skills else 0,
            "total_xp": sum(s.experience_points for s in self.skills.values())
        }
    
    # ==================== Achievement Management ====================
    
    def _unlock_achievement(self, achievement_id: str) -> bool:
        """Unlock an achievement"""
        if achievement_id not in self.achievements:
            return False
        
        achievement = self.achievements[achievement_id]
        if achievement.unlocked:
            return False
        
        achievement.unlocked = True
        achievement.unlocked_date = datetime.datetime.now()
        self.total_points += achievement.points
        self._update_experience(achievement.points)
        
        return True
    
    def _check_achievements(self):
        """Check and unlock any eligible achievements"""
        # Check skill collector
        if len(self.skills) >= 5:
            self._unlock_achievement("skill_collector")
        
        # Check diverse learner
        categories = set(s.category for s in self.skills.values())
        if len(categories) >= 5:
            self._unlock_achievement("diverse_learner")
        
        # Check verification master
        verified_skills = [s for s in self.skills.values() if s.verified_by]
        if len(verified_skills) >= 10:
            self._unlock_achievement("verification_master")
        
        # Check legendary learner
        if self.level >= 10:
            self._unlock_achievement("legendary_learner")
    
    def get_achievements(self, unlocked_only: bool = False) -> List[Achievement]:
        """Get all achievements or only unlocked ones"""
        if unlocked_only:
            return [a for a in self.achievements.values() if a.unlocked]
        return list(self.achievements.values())
    
    def get_achievement_stats(self) -> Dict:
        """Get achievement statistics"""
        total = len(self.achievements)
        unlocked = sum(1 for a in self.achievements.values() if a.unlocked)
        points = sum(a.points for a in self.achievements.values() if a.unlocked)
        
        return {
            "total_achievements": total,
            "unlocked": unlocked,
            "locked": total - unlocked,
            "total_points": points,
            "completion_rate": (unlocked / total * 100) if total > 0 else 0
        }
    
    # ==================== Learning Paths ====================
    
    def create_learning_path(self, name: str, description: str,
                            skills_required: List[str],
                            stages: List[Dict]) -> LearningPath:
        """Create a new learning path"""
        path_id = f"path_{uuid.uuid4().hex[:8]}"
        path = LearningPath(
            id=path_id,
            name=name,
            description=description,
            skills_required=skills_required,
            skills_acquired=[],
            progress=0.0,
            start_date=datetime.datetime.now(),
            stages=stages,
            current_stage=0
        )
        
        self.learning_paths[path_id] = path
        return path
    
    def update_learning_path_progress(self, path_id: str, 
                                     skill_acquired: str) -> bool:
        """Update progress on a learning path"""
        if path_id not in self.learning_paths:
            return False
        
        path = self.learning_paths[path_id]
        if skill_acquired in path.skills_acquired:
            return False
        
        path.skills_acquired.append(skill_acquired)
        path.progress = len(path.skills_acquired) / len(path.skills_required)
        
        # Update current stage
        if path.stages:
            for i, stage in enumerate(path.stages):
                if i > path.current_stage and stage.get('skill') in path.skills_acquired:
                    path.current_stage = i
        
        # Check if path is complete
        if path.progress >= 1.0:
            path.estimated_completion = datetime.datetime.now()
            self._unlock_achievement("learning_path_complete")
            self._update_experience(100)  # Bonus XP for completion
        
        self.last_updated = datetime.datetime.now()
        return True
    
    def get_learning_path_summary(self) -> List[Dict]:
        """Get summary of all learning paths"""
        summaries = []
        for path in self.learning_paths.values():
            summaries.append({
                "name": path.name,
                "progress": f"{path.progress * 100:.1f}%",
                "skills_acquired": len(path.skills_acquired),
                "skills_required": len(path.skills_required),
                "current_stage": path.current_stage + 1 if path.stages else 0,
                "total_stages": len(path.stages) if path.stages else 0
            })
        return summaries
    
    # ==================== Verification System ====================
    
    def request_verification(self, skill_id: str, evidence: List[str] = None) -> VerificationRequest:
        """Request verification for a skill"""
        if skill_id not in self.skills:
            raise ValueError("Skill not found")
        
        request_id = f"verify_{uuid.uuid4().hex[:8]}"
        request = VerificationRequest(
            id=request_id,
            skill_id=skill_id,
            requester_id=self.user_id,
            evidence=evidence or []
        )
        
        self.verification_requests[request_id] = request
        return request
    
    def review_verification(self, request_id: str, verifier_id: str,
                           approved: bool, comment: str = None) -> bool:
        """Review a verification request"""
        if request_id not in self.verification_requests:
            return False
        
        request = self.verification_requests[request_id]
        if request.status != "pending":
            return False
        
        request.verifier_id = verifier_id
        request.review_date = datetime.datetime.now()
        request.status = "approved" if approved else "rejected"
        
        if comment:
            request.comments.append({
                "user": verifier_id,
                "comment": comment,
                "date": datetime.datetime.now().isoformat()
            })
        
        if approved:
            skill = self.skills[request.skill_id]
            skill.verified_by = verifier_id
            skill.verification_date = datetime.datetime.now()
            self._update_experience(15)  # Bonus for verification
        
        self._check_achievements()
        self.last_updated = datetime.datetime.now()
        return True
    
    def get_verification_status(self) -> Dict:
        """Get verification statistics"""
        total = len(self.verification_requests)
        pending = sum(1 for r in self.verification_requests.values() 
                      if r.status == "pending")
        approved = sum(1 for r in self.verification_requests.values() 
                       if r.status == "approved")
        rejected = sum(1 for r in self.verification_requests.values() 
                       if r.status == "rejected")
        
        return {
            "total_requests": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "success_rate": (approved / total * 100) if total > 0 else 0
        }
    
    # ==================== Gamification System ====================
    
    def _update_experience(self, xp_gain: int):
        """Update user experience and level"""
        self.experience += xp_gain
        
        # Level up system
        while self.experience >= self._xp_for_next_level():
            self.experience -= self._xp_for_next_level()
            self.level += 1
            
            # Bonus achievement for reaching milestones
            if self.level in [5, 10, 15, 20]:
                self.total_points += 50 * (self.level // 5)
                self._check_achievements()
    
    def _xp_for_next_level(self) -> int:
        """Calculate XP needed for next level"""
        return 100 + (self.level * 50)
    
    def get_gamification_stats(self) -> Dict:
        """Get gamification statistics"""
        return {
            "level": self.level,
            "experience": self.experience,
            "xp_to_next_level": self._xp_for_next_level(),
            "progress_to_next_level": (self.experience / self._xp_for_next_level() * 100),
            "total_points": self.total_points,
            "skills_count": len(self.skills),
            "achievements_unlocked": sum(1 for a in self.achievements.values() if a.unlocked)
        }
    
    # ==================== Leaderboard & Social ====================
    
    def get_leaderboard_position(self, all_wallets: List['SkillWallet']) -> int:
        """Get position in leaderboard (1-based)"""
        sorted_wallets = sorted(all_wallets, 
                              key=lambda w: (w.total_points, len(w.skills)), 
                              reverse=True)
        try:
            return sorted_wallets.index(self) + 1
        except ValueError:
            return len(sorted_wallets) + 1
    
    def share_skill(self, skill_id: str, platform: str = "social") -> Dict:
        """Share a skill on social platforms"""
        if skill_id not in self.skills:
            return {"success": False, "error": "Skill not found"}
        
        skill = self.skills[skill_id]
        share_data = {
            "user": self.user_name,
            "skill": skill.name,
            "level": skill.level,
            "category": skill.category,
            "verified": bool(skill.verified_by),
            "platform": platform,
            "share_date": datetime.datetime.now().isoformat(),
            "share_id": f"share_{uuid.uuid4().hex[:8]}"
        }
        
        # Generate shareable badge
        badge = self._generate_badge(skill)
        
        return {
            "success": True,
            "share_data": share_data,
            "badge": badge,
            "platforms": ["LinkedIn", "Twitter", "GitHub", "Portfolio"]
        }
    
    def _generate_badge(self, skill: Skill) -> Dict:
        """Generate a visual badge for a skill"""
        level_colors = {
            1: "Green",
            2: "Blue",
            3: "Silver",
            4: "Gold",
            5: "Platinum"
        }
        
        return {
            "skill": skill.name,
            "level": skill.level,
            "level_name": SkillLevel(skill.level).name,
            "color": level_colors.get(skill.level, "Default"),
            "verified": "✓" if skill.verified_by else "Pending",
            "style": f"Badge_{skill.category}_{skill.level}"
        }
    
    # ==================== Export & Import ====================
    
    def export_wallet(self, include_proofs: bool = False) -> Dict:
        """Export wallet data as dictionary"""
        data = {
            "user_id": self.user_id,
            "user_name": self.user_name,
            "level": self.level,
            "experience": self.experience,
            "total_points": self.total_points,
            "created_date": self.created_date.isoformat(),
            "last_updated": self.last_updated.isoformat(),
            "tags": list(self.tags),
            "blockchain_hash": self.blockchain_hash,
            "skills": [s.to_dict() for s in self.skills.values()],
            "achievements": [
                {
                    "id": a.id,
                    "name": a.name,
                    "description": a.description,
                    "rarity": a.rarity,
                    "points": a.points,
                    "unlocked": a.unlocked,
                    "unlocked_date": a.unlocked_date.isoformat() if a.unlocked_date else None
                }
                for a in self.achievements.values()
            ],
            "learning_paths": [
                {
                    "name": p.name,
                    "progress": p.progress,
                    "skills_acquired": p.skills_acquired,
                    "skills_required": p.skills_required,
                    "start_date": p.start_date.isoformat()
                }
                for p in self.learning_paths.values()
            ]
        }
        
        if not include_proofs:
            # Remove proof data for privacy
            for skill in data["skills"]:
                skill.pop("proof_links", None)
        
        return data
    
    def import_wallet(self, data: Dict) -> bool:
        """Import wallet data from dictionary"""
        try:
            self.user_name = data.get("user_name", self.user_name)
            self.level = data.get("level", 1)
            self.experience = data.get("experience", 0)
            self.total_points = data.get("total_points", 0)
            self.tags = set(data.get("tags", []))
            
            # Import skills
            for skill_data in data.get("skills", []):
                skill = Skill(**skill_data)
                self.skills[skill.id] = skill
            
            # Import achievements
            for ach_data in data.get("achievements", []):
                if ach_data["id"] in self.achievements:
                    achievement = self.achievements[ach_data["id"]]
                    achievement.unlocked = ach_data.get("unlocked", False)
                    if achievement.unlocked:
                        achievement.unlocked_date = datetime.datetime.fromisoformat(
                            ach_data["unlocked_date"]
                        ) if ach_data.get("unlocked_date") else datetime.datetime.now()
            
            self.last_updated = datetime.datetime.now()
            return True
            
        except Exception as e:
            print(f"Import error: {e}")
            return False
    
    def to_json(self, filename: str = None) -> str:
        """Export wallet to JSON string"""
        data = self.export_wallet()
        json_str = json.dumps(data, indent=2, default=str)
        
        if filename:
            with open(filename, 'w') as f:
                f.write(json_str)
        
        return json_str
    
    @classmethod
    def from_json(cls, json_str: str, user_id: str) -> 'SkillWallet':
        """Create wallet from JSON string"""
        data = json.loads(json_str) if isinstance(json_str, str) else json_str
        wallet = cls(user_id, data.get("user_name", "Unknown"))
        wallet.import_wallet(data)
        return wallet
    
    # ==================== Utility Methods ====================
    
    def get_statistics(self) -> Dict:
        """Get comprehensive statistics"""
        return {
            "user": {
                "id": self.user_id,
                "name": self.user_name,
                "level": self.level,
                "total_points": self.total_points,
                "experience": self.experience
            },
            "skills": self.get_skill_summary(),
            "achievements": self.get_achievement_stats(),
            "verification": self.get_verification_status(),
            "learning_paths": {
                "total": len(self.learning_paths),
                "completed": sum(1 for p in self.learning_paths.values() if p.progress >= 1.0),
                "in_progress": sum(1 for p in self.learning_paths.values() if 0 < p.progress < 1.0)
            },
            "gamification": self.get_gamification_stats()
        }
    
    def generate_report(self) -> str:
        """Generate a human-readable report"""
        stats = self.get_statistics()
        report = []
        
        report.append("=" * 60)
        report.append(f"SKILL WALLET REPORT - {self.user_name}".center(60))
        report.append("=" * 60)
        report.append(f"\n📊 LEVEL: {stats['user']['level']} | 🏆 POINTS: {stats['user']['total_points']}")
        report.append(f"💡 EXPERIENCE: {stats['user']['experience']} XP")
        report.append(f"📅 WALLET ACTIVE: {(datetime.datetime.now() - self.created_date).days} days\n")
        
        # Skills
        report.append("🛠️ SKILLS")
        report.append("-" * 40)
        if self.skills:
            for skill in self.skills.values():
                verified = "✅" if skill.verified_by else "⏳"
                report.append(f"  {verified} {skill.name} (Lv.{skill.level}) - {skill.category}")
        else:
            report.append("  No skills added yet")
        
        # Achievements
        report.append(f"\n🏅 ACHIEVEMENTS ({stats['achievements']['unlocked']}/{stats['achievements']['total_achievements']})")
        report.append("-" * 40)
        unlocked = [a for a in self.achievements.values() if a.unlocked]
        if unlocked:
            for ach in sorted(unlocked, key=lambda x: x.points, reverse=True)[:10]:
                report.append(f"  🌟 {ach.name} ({ach.rarity}) - {ach.points}pts")
        else:
            report.append("  No achievements unlocked yet")
        
        # Learning Paths
        report.append(f"\n🎯 LEARNING PATHS")
        report.append("-" * 40)
        if self.learning_paths:
            for path in self.learning_paths.values():
                progress_bar = "█" * int(path.progress * 20) + "░" * (20 - int(path.progress * 20))
                report.append(f"  {path.name}: [{progress_bar}] {path.progress*100:.0f}%")
        else:
            report.append("  No learning paths started")
        
        # Recommendations
        report.append(f"\n💡 RECOMMENDATIONS")
        report.append("-" * 40)
        recommendations = self._generate_recommendations()
        for rec in recommendations:
            report.append(f"  📌 {rec}")
        
        report.append("\n" + "=" * 60)
        return "\n".join(report)
    
    def _generate_recommendations(self) -> List[str]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # Skill recommendations
        if len(self.skills) < 3:
            recommendations.append("Add more skills to your wallet")
        
        # Level up recommendations
        if any(s.level < 3 for s in self.skills.values()):
            recommendations.append("Level up your skills to increase your overall rating")
        
        # Achievement hunting
        locked = [a for a in self.achievements.values() if not a.unlocked]
        if locked:
            recommendations.append(f"Work towards unlocking: {random.choice(locked).name}")
        
        # Learning paths
        if self.learning_paths:
            incomplete = [p for p in self.learning_paths.values() if p.progress < 1.0]
            if incomplete:
                rec_path = random.choice(incomplete)
                recommendations.append(f"Continue your learning path: {rec_path.name}")
        
        # Verification
        unverified = [s for s in self.skills.values() if not s.verified_by]
        if unverified:
            recommendations.append(f"Get verification for: {random.choice(unverified).name}")
        
        if not recommendations:
            recommendations.append("You're doing great! Continue building your skills!")
        
        return recommendations

# ==================== Skill Wallet Network ====================

class SkillWalletNetwork:
    """A network of skill wallets for social features"""
    
    def __init__(self):
        self.wallets: Dict[str, SkillWallet] = {}
        self.connections: Dict[str, Set[str]] = {}
        self.endorsements: Dict[str, List[Dict]] = {}
    
    def register_wallet(self, wallet: SkillWallet) -> bool:
        """Register a wallet in the network"""
        if wallet.user_id in self.wallets:
            return False
        
        self.wallets[wallet.user_id] = wallet
        self.connections[wallet.user_id] = set()
        self.endorsements[wallet.user_id] = []
        return True
    
    def connect_wallets(self, user1_id: str, user2_id: str) -> bool:
        """Connect two wallets (friendship/connection)"""
        if user1_id not in self.wallets or user2_id not in self.wallets:
            return False
        
        self.connections[user1_id].add(user2_id)
        self.connections[user2_id].add(user1_id)
        return True
    
    def endorse_skill(self, endorser_id: str, target_id: str, 
                     skill_id: str, comment: str = None) -> bool:
        """Endorse another user's skill"""
        if endorser_id not in self.wallets or target_id not in self.wallets:
            return False
        
        if target_id not in self.connections.get(endorser_id, set()):
            return False
        
        wallet = self.wallets[target_id]
        if skill_id not in wallet.skills:
            return False
        
        endorsement = {
            "endorser": endorser_id,
            "skill_id": skill_id,
            "skill_name": wallet.skills[skill_id].name,
            "comment": comment or "Great skill!",
            "date": datetime.datetime.now().isoformat()
        }
        
        self.endorsements[target_id].append(endorsement)
        
        # Award bonus XP for receiving endorsement
        wallet._update_experience(10)
        
        return True
    
    def get_network_stats(self, user_id: str) -> Dict:
        """Get network statistics for a user"""
        if user_id not in self.wallets:
            return {}
        
        wallet = self.wallets[user_id]
        connections = len(self.connections.get(user_id, set()))
        endorsements = len(self.endorsements.get(user_id, []))
        
        # Get leaderboard position
        position = wallet.get_leaderboard_position(list(self.wallets.values()))
        
        return {
            "connections": connections,
            "endorsements": endorsements,
            "leaderboard_position": position,
            "total_users": len(self.wallets),
            "network_influence": (connections + endorsements) / len(self.wallets) * 100 if self.wallets else 0
        }
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict]:
        """Get top wallets by points"""
        sorted_wallets = sorted(self.wallets.values(), 
                              key=lambda w: (w.total_points, len(w.skills)), 
                              reverse=True)
        
        return [
            {
                "rank": i + 1,
                "user": wallet.user_name,
                "points": wallet.total_points,
                "level": wallet.level,
                "skills": len(wallet.skills),
                "achievements": sum(1 for a in wallet.achievements.values() if a.unlocked)
            }
            for i, wallet in enumerate(sorted_wallets[:limit])
        ]

# ==================== CLI Application ====================

class SkillWalletCLI:
    """Command-line interface for the Skill Wallet System"""
    
    def __init__(self):
        self.network = SkillWalletNetwork()
        self.current_wallet: Optional[SkillWallet] = None
        self.user_id = None
        
    def run(self):
        """Main application loop"""
        print("\n" + "=" * 60)
        print("🎯 SKILL WALLET ACHIEVEMENT SYSTEM".center(60))
        print("=" * 60)
        
        while True:
            if not self.current_wallet:
                self._login_menu()
            else:
                self._main_menu()
    
    def _login_menu(self):
        """Login or create new wallet"""
        print("\n🔐 AUTHENTICATION")
        print("-" * 40)
        print("1. Create New Wallet")
        print("2. Login to Existing Wallet")
        print("3. Exit")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            self._create_wallet()
        elif choice == "2":
            self._login_wallet()
        elif choice == "3":
            print("\n👋 Goodbye! Keep building your skills!")
            exit()
        else:
            print("❌ Invalid option")
    
    def _create_wallet(self):
        """Create a new skill wallet"""
        print("\n✨ CREATE NEW WALLET")
        username = input("Enter your name: ").strip()
        if not username:
            username = f"User_{random.randint(1000, 9999)}"
        
        user_id = f"user_{uuid.uuid4().hex[:8]}"
        wallet = SkillWallet(user_id, username)
        self.network.register_wallet(wallet)
        self.current_wallet = wallet
        self.user_id = user_id
        
        print(f"\n✅ Wallet created successfully!")
        print(f"📋 User ID: {user_id}")
        print(f"👤 Username: {username}")
        
        # Add welcome skills
        print("\n🎯 Let's add your first skill!")
        self._add_skill_flow()
    
    def _login_wallet(self):
        """Login to existing wallet"""
        print("\n🔑 LOGIN")
        user_id = input("Enter your User ID: ").strip()
        
        if user_id in self.network.wallets:
            self.current_wallet = self.network.wallets[user_id]
            self.user_id = user_id
            print(f"\n✅ Welcome back, {self.current_wallet.user_name}!")
        else:
            print("❌ Wallet not found")
    
    def _main_menu(self):
        """Main application menu"""
        print("\n" + "=" * 60)
        print(f"👤 {self.current_wallet.user_name} | Level {self.current_wallet.level} | 🏆 {self.current_wallet.total_points}pts")
        print("=" * 60)
        
        print("\n📋 MENU")
        print("-" * 40)
        print("1. 🛠️ Manage Skills")
        print("2. 🏅 View Achievements")
        print("3. 🎯 Learning Paths")
        print("4. ✅ Verification System")
        print("5. 📊 View Statistics")
        print("6. 🌐 Network & Social")
        print("7. 💾 Export Wallet")
        print("8. 📋 Generate Report")
        print("9. 🚪 Logout")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            self._skill_menu()
        elif choice == "2":
            self._achievement_menu()
        elif choice == "3":
            self._learning_path_menu()
        elif choice == "4":
            self._verification_menu()
        elif choice == "5":
            self._statistics_menu()
        elif choice == "6":
            self._network_menu()
        elif choice == "7":
            self._export_menu()
        elif choice == "8":
            self._report_menu()
        elif choice == "9":
            self.current_wallet = None
            print("\n👋 Logged out successfully!")
        else:
            print("❌ Invalid option")
    
    def _skill_menu(self):
        """Skill management menu"""
        print("\n🛠️ SKILL MANAGEMENT")
        print("-" * 40)
        print("1. Add New Skill")
        print("2. View All Skills")
        print("3. Update Skill Level")
        print("4. View Skill Summary")
        print("5. Back")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            self._add_skill_flow()
        elif choice == "2":
            self._view_skills()
        elif choice == "3":
            self._update_skill_level()
        elif choice == "4":
            summary = self.current_wallet.get_skill_summary()
            print("\n📊 SKILL SUMMARY")
            print("-" * 40)
            print(f"Total Skills: {summary['total_skills']}")
            print(f"Average Level: {summary['avg_level']:.1f}")
            print(f"Total XP: {summary['total_xp']}")
            print("\nCategories:")
            for cat, data in summary['categories'].items():
                print(f"  • {cat}: {data['count']} skills, Avg Level: {data['avg_level']:.1f}")
        elif choice == "5":
            return
        else:
            print("❌ Invalid option")
    
    def _add_skill_flow(self):
        """Flow for adding a new skill"""
        print("\n✨ ADD NEW SKILL")
        name = input("Skill name: ").strip()
        if not name:
            print("❌ Skill name required")
            return
        
        print("\nCategories: Technology, Design, Business, Language, Arts, Sports, Other")
        category = input("Category: ").strip() or "Other"
        
        level = input("Level (1-5, default 1): ").strip()
        try:
            level = int(level) if level else 1
            level = max(1, min(5, level))
        except ValueError:
            level = 1
        
        proof = input("Proof link (optional): ").strip()
        proof_links = [proof] if proof else []
        
        skill = self.current_wallet.add_skill(name, category, level, proof_links)
        print(f"\n✅ Skill '{name}' added successfully!")
        print(f"📋 Skill ID: {skill.id}")
        print(f"⭐ Level: {skill.level}")
        
        # Check for achievement
        if len(self.current_wallet.skills) == 1:
            self.current_wallet._unlock_achievement("first_skill")
            print("🏅 Achievement Unlocked: First Skill!")
    
    def _view_skills(self):
        """View all skills"""
        print("\n📋 ALL SKILLS")
        print("-" * 40)
        
        if not self.current_wallet.skills:
            print("No skills added yet")
            return
        
        for skill in self.current_wallet.skills.values():
            verified = "✅ Verified" if skill.verified_by else "⏳ Pending Verification"
            print(f"\n🔹 {skill.name}")
            print(f"   Level: {skill.level}/5 | Category: {skill.category}")
            print(f"   Status: {verified}")
            print(f"   XP: {skill.experience_points}")
            if skill.milestones:
                print(f"   Milestones: {', '.join(skill.milestones[-3:])}")
    
    def _update_skill_level(self):
        """Update skill level"""
        print("\n⬆️ UPDATE SKILL LEVEL")
        self._view_skills()
        
        skill_id = input("\nEnter Skill ID to update: ").strip()
        if skill_id not in self.current_wallet.skills:
            print("❌ Skill not found")
            return
        
        skill = self.current_wallet.skills[skill_id]
        print(f"\nCurrent level: {skill.level}")
        new_level = input("New level (1-5): ").strip()
        
        try:
            new_level = int(new_level)
            if self.current_wallet.update_skill_level(skill_id, new_level):
                print(f"✅ Skill level updated to {new_level}!")
            else:
                print("❌ Update failed. New level must be higher than current level.")
        except ValueError:
            print("❌ Invalid level")
    
    def _achievement_menu(self):
        """Achievement viewing menu"""
        print("\n🏅 ACHIEVEMENTS")
        print("-" * 40)
        
        stats = self.current_wallet.get_achievement_stats()
        print(f"Unlocked: {stats['unlocked']}/{stats['total_achievements']}")
        print(f"Completion Rate: {stats['completion_rate']:.1f}%")
        print(f"Total Points: {stats['total_points']}\n")
        
        print("1. View Unlocked Achievements")
        print("2. View All Achievements")
        print("3. Back")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            unlocked = self.current_wallet.get_achievements(unlocked_only=True)
            print("\n🌟 UNLOCKED ACHIEVEMENTS")
            print("-" * 40)
            if unlocked:
                for ach in sorted(unlocked, key=lambda x: x.points, reverse=True):
                    print(f"  {ach.name} ({ach.rarity}) - {ach.points}pts")
                    print(f"  {ach.description}\n")
            else:
                print("No achievements unlocked yet")
        
        elif choice == "2":
            all_ach = self.current_wallet.get_achievements()
            print("\n📋 ALL ACHIEVEMENTS")
            print("-" * 40)
            for ach in all_ach:
                status = "✅" if ach.unlocked else "🔒"
                print(f"  {status} {ach.name} ({ach.rarity}) - {ach.points}pts")
                print(f"  {ach.description}\n")
    
    def _learning_path_menu(self):
        """Learning path management"""
        print("\n🎯 LEARNING PATHS")
        print("-" * 40)
        print("1. Create Learning Path")
        print("2. View Learning Paths")
        print("3. Update Progress")
        print("4. Back")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            self._create_learning_path()
        elif choice == "2":
            self._view_learning_paths()
        elif choice == "3":
            self._update_learning_path()
    
    def _create_learning_path(self):
        """Create a new learning path"""
        print("\n✨ CREATE LEARNING PATH")
        name = input("Path name: ").strip()
        description = input("Description: ").strip()
        
        # Get skills required
        print("\nRequired Skills (enter skill names, comma-separated):")
        skills_input = input("Skills: ").strip()
        skills_required = [s.strip() for s in skills_input.split(",") if s.strip()]
        
        if not skills_required:
            print("❌ At least one skill required")
            return
        
        # Create stages
        stages = []
        print("\nDefine stages (optional, enter 'done' when finished):")
        while True:
            stage_name = input("Stage name (or 'done'): ").strip()
            if stage_name.lower() == "done" or not stage_name:
                break
            stage_skill = input("Skill to acquire in this stage: ").strip()
            stages.append({
                "name": stage_name,
                "skill": stage_skill
            })
        
        path = self.current_wallet.create_learning_path(
            name, description, skills_required, stages
        )
        print(f"\n✅ Learning path created: {name}")
        print(f"📋 Path ID: {path.id}")
    
    def _view_learning_paths(self):
        """View all learning paths"""
        print("\n📋 LEARNING PATHS")
        print("-" * 40)
        
        paths = self.current_wallet.get_learning_path_summary()
        if not paths:
            print("No learning paths")
            return
        
        for path in paths:
            print(f"\n🔹 {path['name']}")
            print(f"   Progress: {path['progress']}")
            print(f"   Skills: {path['skills_acquired']}/{path['skills_required']}")
            if path['total_stages'] > 0:
                print(f"   Stage: {path['current_stage']}/{path['total_stages']}")
    
    def _update_learning_path(self):
        """Update learning path progress"""
        print("\n⬆️ UPDATE LEARNING PATH")
        self._view_learning_paths()
        
        path_id = input("\nEnter Path ID: ").strip()
        skill_acquired = input("Skill acquired: ").strip()
        
        if self.current_wallet.update_learning_path_progress(path_id, skill_acquired):
            print(f"✅ Progress updated!")
        else:
            print("❌ Update failed")
    
    def _verification_menu(self):
        """Verification management"""
        print("\n✅ VERIFICATION SYSTEM")
        print("-" * 40)
        print("1. Request Skill Verification")
        print("2. Review Verification Requests (as Verifier)")
        print("3. View Verification Status")
        print("4. Back")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            self._request_verification()
        elif choice == "2":
            self._review_verification()
        elif choice == "3":
            status = self.current_wallet.get_verification_status()
            print("\n📊 VERIFICATION STATUS")
            print("-" * 40)
            print(f"Total Requests: {status['total_requests']}")
            print(f"Pending: {status['pending']}")
            print(f"Approved: {status['approved']}")
            print(f"Rejected: {status['rejected']}")
            print(f"Success Rate: {status['success_rate']:.1f}%")
    
    def _request_verification(self):
        """Request skill verification"""
        print("\n📤 REQUEST VERIFICATION")
        self._view_skills()
        
        skill_id = input("\nEnter Skill ID to verify: ").strip()
        if skill_id not in self.current_wallet.skills:
            print("❌ Skill not found")
            return
        
        evidence = []
        print("Add evidence (enter 'done' to finish):")
        while True:
            link = input("Evidence link (or 'done'): ").strip()
            if link.lower() == "done" or not link:
                break
            evidence.append(link)
        
        request = self.current_wallet.request_verification(skill_id, evidence)
        print(f"\n✅ Verification request submitted!")
        print(f"📋 Request ID: {request.id}")
    
    def _review_verification(self):
        """Review verification requests (simplified)"""
        print("\n📋 PENDING REQUESTS")
        print("-" * 40)
        
        pending = [r for r in self.current_wallet.verification_requests.values()
                  if r.status == "pending"]
        
        if not pending:
            print("No pending requests")
            return
        
        for req in pending:
            skill = self.current_wallet.skills[req.skill_id]
            print(f"\nRequest: {req.id}")
            print(f"Skill: {skill.name}")
            print(f"Submitted: {req.submitted_date}")
            if req.evidence:
                print(f"Evidence: {', '.join(req.evidence[:2])}")
        
        request_id = input("\nEnter Request ID to review: ").strip()
        if request_id not in self.current_wallet.verification_requests:
            print("❌ Request not found")
            return
        
        print("\n1. Approve")
        print("2. Reject")
        choice = input("Decision: ").strip()
        
        if choice == "1":
            comment = input("Comment (optional): ").strip()
            verifier_id = self.user_id
            if self.current_wallet.review_verification(request_id, verifier_id, True, comment):
                print("✅ Verification approved!")
        elif choice == "2":
            comment = input("Reason for rejection: ").strip()
            verifier_id = self.user_id
            if self.current_wallet.review_verification(request_id, verifier_id, False, comment):
                print("❌ Verification rejected")
    
    def _statistics_menu(self):
        """View statistics"""
        print("\n📊 STATISTICS")
        print("-" * 40)
        
        stats = self.current_wallet.get_statistics()
        
        print("👤 USER PROFILE")
        print(f"  Name: {stats['user']['name']}")
        print(f"  Level: {stats['user']['level']}")
        print(f"  Points: {stats['user']['total_points']}")
        print(f"  Experience: {stats['user']['experience']} XP\n")
        
        print("🛠️ SKILLS")
        print(f"  Total: {stats['skills']['total_skills']}")
        print(f"  Average Level: {stats['skills']['avg_level']:.1f}")
        print(f"  Categories: {len(stats['skills']['categories'])}\n")
        
        print("🏅 ACHIEVEMENTS")
        print(f"  Unlocked: {stats['achievements']['unlocked']}")
        print(f"  Completion: {stats['achievements']['completion_rate']:.1f}%\n")
        
        print("✅ VERIFICATION")
        print(f"  Approved: {stats['verification']['approved']}")
        print(f"  Pending: {stats['verification']['pending']}\n")
        
        print("🎯 LEARNING PATHS")
        print(f"  Total: {stats['learning_paths']['total']}")
        print(f"  Completed: {stats['learning_paths']['completed']}")
    
    def _network_menu(self):
        """Network and social features"""
        print("\n🌐 NETWORK & SOCIAL")
        print("-" * 40)
        
        network_stats = self.network.get_network_stats(self.user_id)
        print("Network Stats:")
        print(f"  Connections: {network_stats.get('connections', 0)}")
        print(f"  Endorsements: {network_stats.get('endorsements', 0)}")
        print(f"  Leaderboard Position: #{network_stats.get('leaderboard_position', 'N/A')}")
        
        print("\n1. Connect with User")
        print("2. Endorse a Skill")
        print("3. View Leaderboard")
        print("4. Back")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            print("\n🔗 CONNECT WITH USER")
            user_id = input("Enter User ID to connect: ").strip()
            if self.network.connect_wallets(self.user_id, user_id):
                print("✅ Connection established!")
            else:
                print("❌ Connection failed")
        
        elif choice == "2":
            print("\n📝 ENDORSE A SKILL")
            target_id = input("Enter User ID to endorse: ").strip()
            if target_id not in self.network.wallets:
                print("❌ User not found")
                return
            
            target_wallet = self.network.wallets[target_id]
            print("\nTarget's Skills:")
            for skill in target_wallet.skills.values():
                print(f"  {skill.id}: {skill.name} (Lv.{skill.level})")
            
            skill_id = input("\nEnter Skill ID to endorse: ").strip()
            comment = input("Endorsement comment: ").strip()
            
            if self.network.endorse_skill(self.user_id, target_id, skill_id, comment):
                print("✅ Endorsement added! You earned 10 XP!")
            else:
                print("❌ Endorsement failed")
        
        elif choice == "3":
            print("\n🏆 LEADERBOARD")
            print("-" * 40)
            leaderboard = self.network.get_leaderboard(10)
            for entry in leaderboard:
                print(f"#{entry['rank']} {entry['user']} - {entry['points']}pts")
                print(f"   Level {entry['level']} | {entry['skills']} skills | {entry['achievements']} achievements\n")
    
    def _export_menu(self):
        """Export wallet data"""
        print("\n💾 EXPORT WALLET")
        print("-" * 40)
        
        include_proofs = input("Include proof links? (y/n): ").strip().lower() == 'y'
        filename = input("Filename (default: wallet_export.json): ").strip() or "wallet_export.json"
        
        json_data = self.current_wallet.to_json(filename)
        print(f"✅ Wallet exported to {filename}")
        
        # Generate shareable profile
        print("\n📱 SHAREABLE PROFILE")
        stats = self.current_wallet.get_gamification_stats()
        print(f"Name: {self.current_wallet.user_name}")
        print(f"Level: {stats['level']} | Points: {stats['total_points']}")
        print(f"Skills: {stats['skills_count']} | Achievements: {stats['achievements_unlocked']}")
        
        share = input("\nShare profile link? (y/n): ").strip().lower() == 'y'
        if share:
            profile_id = f"profile_{self.current_wallet.blockchain_hash}"
            print(f"\n🔗 Profile URL: https://skillwallet.com/profile/{profile_id}")
            print("📋 Copy this link to share your profile!")
    
    def _report_menu(self):
        """Generate and display report"""
        print("\n📋 GENERATING REPORT...")
        report = self.current_wallet.generate_report()
        print(report)
        
        save = input("\nSave report to file? (y/n): ").strip().lower() == 'y'
        if save:
            filename = f"report_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
            with open(filename, 'w') as f:
                f.write(report)
            print(f"✅ Report saved to {filename}")

# ==================== Main Execution ====================

def main():
    """Main function to run the Skill Wallet Achievement System"""
    cli = SkillWalletCLI()
    
    try:
        cli.run()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye! Keep learning and growing!")
    except Exception as e:
        print(f"\n❌ An error occurred: {e}")
        raise

if __name__ == "__main__":
    main()
