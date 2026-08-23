"""
Skill Wallet Core Infrastructure
A comprehensive system for tracking, verifying, and rewarding sustainability skills and competencies
"""

import hashlib
import json
import pickle
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set, Tuple, Any
from enum import Enum
import pandas as pd
import numpy as np
from dataclasses import dataclass, asdict
from collections import defaultdict
import uuid
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import warnings
warnings.filterwarnings('ignore')


class SkillLevel(Enum):
    """Skill proficiency levels"""
    NOVICE = 1
    BEGINNER = 2
    INTERMEDIATE = 3
    ADVANCED = 4
    EXPERT = 5
    MASTER = 6


class SkillCategory(Enum):
    """Sustainability skill categories"""
    ENERGY_MANAGEMENT = "energy_management"
    WASTE_REDUCTION = "waste_reduction"
    WATER_CONSERVATION = "water_conservation"
    SUSTAINABLE_TRANSPORT = "sustainable_transport"
    SUSTAINABLE_FOOD = "sustainable_food"
    GREEN_BUILDING = "green_building"
    CARBON_LITERACY = "carbon_literacy"
    CIRCULAR_ECONOMY = "circular_economy"
    RENEWABLE_ENERGY = "renewable_energy"
    SUSTAINABLE_FINANCE = "sustainable_finance"
    ECO_INNOVATION = "eco_innovation"
    COMMUNITY_ENGAGEMENT = "community_engagement"


class VerificationStatus(Enum):
    """Verification status for skills"""
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"
    EXPIRED = "expired"
    REVOKED = "revoked"


@dataclass
class Skill:
    """Skill data structure"""
    skill_id: str
    name: str
    category: SkillCategory
    description: str
    level: SkillLevel
    points: int
    prerequisites: List[str]
    learning_resources: List[Dict]
    verification_methods: List[str]
    expiry_days: Optional[int] = 365
    created_at: datetime = None
    updated_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        if self.updated_at is None:
            self.updated_at = datetime.now()


@dataclass
class SkillWallet:
    """User's skill wallet"""
    wallet_id: str
    user_id: int
    skills: Dict[str, 'SkillInstance']
    total_points: int
    level: int
    badges: Set[str]
    created_at: datetime
    updated_at: datetime


@dataclass
class SkillInstance:
    """Instance of a skill earned by a user"""
    instance_id: str
    skill_id: str
    user_id: int
    level: SkillLevel
    points: int
    progress: float  # 0-100
    verified: bool
    verification_status: VerificationStatus
    verification_data: Dict
    issued_date: datetime
    expiry_date: Optional[datetime]
    last_used: Optional[datetime]
    endorsements: List[Dict]
    proof: List[Dict]
    notes: List[str]
    
    def is_expired(self) -> bool:
        if self.expiry_date:
            return datetime.now() > self.expiry_date
        return False
    
    def is_active(self) -> bool:
        return self.verified and not self.is_expired()


class SkillVerificationSystem:
    """Handles skill verification and validation"""
    
    def __init__(self):
        self.verification_methods = {
            'quiz': self._verify_quiz,
            'project': self._verify_project,
            'peer_review': self._verify_peer_review,
            'certification': self._verify_certification,
            'practical_demonstration': self._verify_practical,
            'portfolio_review': self._verify_portfolio,
            'exam': self._verify_exam
        }
        self.verification_history = defaultdict(list)
        
    def verify_skill(self, skill_instance: SkillInstance, 
                     verification_method: str, 
                     evidence: Dict) -> Tuple[bool, str]:
        """
        Verify a skill using specified method
        
        Args:
            skill_instance: Skill instance to verify
            verification_method: Method to use
            evidence: Evidence data
            
        Returns:
            (verification_result, message)
        """
        if verification_method not in self.verification_methods:
            return False, f"Unsupported verification method: {verification_method}"
        
        # Check if skill is already verified
        if skill_instance.verified:
            return False, "Skill is already verified"
        
        # Perform verification
        verification_func = self.verification_methods[verification_method]
        result, message = verification_func(skill_instance, evidence)
        
        # Update skill instance
        if result:
            skill_instance.verified = True
            skill_instance.verification_status = VerificationStatus.VERIFIED
            skill_instance.verification_data = {
                'method': verification_method,
                'date': datetime.now().isoformat(),
                'evidence': evidence
            }
        else:
            skill_instance.verification_status = VerificationStatus.REJECTED
        
        # Record verification attempt
        self.verification_history[skill_instance.instance_id].append({
            'method': verification_method,
            'result': result,
            'message': message,
            'timestamp': datetime.now().isoformat()
        })
        
        return result, message
    
    def _verify_quiz(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through quiz completion"""
        required_score = evidence.get('required_score', 80)
        actual_score = evidence.get('score', 0)
        
        if actual_score >= required_score:
            return True, f"Quiz passed with score {actual_score}%"
        return False, f"Quiz score {actual_score}% below required {required_score}%"
    
    def _verify_project(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through project completion"""
        project_type = evidence.get('type', '')
        quality_score = evidence.get('quality_score', 0)
        
        if quality_score >= 70 and project_type:
            return True, f"Project approved with quality score {quality_score}"
        return False, "Project does not meet quality standards"
    
    def _verify_peer_review(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through peer review"""
        reviews = evidence.get('reviews', [])
        required_reviews = evidence.get('required_reviews', 3)
        
        if len(reviews) >= required_reviews:
            avg_rating = sum(r.get('rating', 0) for r in reviews) / len(reviews)
            if avg_rating >= 4.0:
                return True, f"Peer review passed with average rating {avg_rating:.1f}/5"
        return False, "Insufficient or low-quality peer reviews"
    
    def _verify_certification(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through external certification"""
        cert_id = evidence.get('certification_id')
        issuing_body = evidence.get('issuing_body')
        expiry = evidence.get('expiry_date')
        
        if cert_id and issuing_body:
            # Check if certification is valid
            if expiry and datetime.fromisoformat(expiry) < datetime.now():
                return False, "Certification has expired"
            return True, f"Verified {issuing_body} certification"
        return False, "Invalid certification details"
    
    def _verify_practical(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through practical demonstration"""
        demonstration_score = evidence.get('demonstration_score', 0)
        assessor = evidence.get('assessor', '')
        
        if demonstration_score >= 75 and assessor:
            return True, f"Practical demonstration passed with score {demonstration_score}"
        return False, "Practical demonstration did not meet standards"
    
    def _verify_portfolio(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through portfolio review"""
        portfolio_completeness = evidence.get('completeness', 0)
        quality_rating = evidence.get('quality_rating', 0)
        
        if portfolio_completeness >= 80 and quality_rating >= 70:
            return True, "Portfolio meets all requirements"
        return False, "Portfolio incomplete or low quality"
    
    def _verify_exam(self, skill_instance: SkillInstance, evidence: Dict) -> Tuple[bool, str]:
        """Verify through formal examination"""
        exam_score = evidence.get('score', 0)
        passing_score = evidence.get('passing_score', 70)
        
        if exam_score >= passing_score:
            return True, f"Exam passed with score {exam_score}%"
        return False, f"Exam score {exam_score}% below passing {passing_score}%"


class SkillMintingSystem:
    """Handles creation and issuance of skills"""
    
    def __init__(self):
        self.skill_templates = self._initialize_skill_templates()
        self.issued_skills = {}
        self.transaction_history = []
        
    def _initialize_skill_templates(self) -> Dict:
        """Initialize skill templates for all categories"""
        return {
            # Energy Management Skills
            'energy_audit': Skill(
                skill_id='energy_audit',
                name='Energy Audit Specialist',
                category=SkillCategory.ENERGY_MANAGEMENT,
                description='Ability to conduct comprehensive energy audits',
                level=SkillLevel.INTERMEDIATE,
                points=100,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Energy Auditing 101', 'url': '#'},
                    {'type': 'tool', 'name': 'Energy Audit Kit', 'url': '#'}
                ],
                verification_methods=['quiz', 'project', 'certification']
            ),
            'solar_installation': Skill(
                skill_id='solar_installation',
                name='Solar Installation Specialist',
                category=SkillCategory.RENEWABLE_ENERGY,
                description='Expertise in solar panel installation and maintenance',
                level=SkillLevel.ADVANCED,
                points=150,
                prerequisites=['energy_audit'],
                learning_resources=[
                    {'type': 'course', 'name': 'Solar Installation Course', 'url': '#'},
                    {'type': 'video', 'name': 'Installation Best Practices', 'url': '#'}
                ],
                verification_methods=['exam', 'practical_demonstration', 'certification']
            ),
            
            # Waste Reduction Skills
            'zero_waste_expert': Skill(
                skill_id='zero_waste_expert',
                name='Zero Waste Expert',
                category=SkillCategory.WASTE_REDUCTION,
                description='Advanced knowledge of zero-waste principles and practices',
                level=SkillLevel.ADVANCED,
                points=120,
                prerequisites=[],
                learning_resources=[
                    {'type': 'book', 'name': 'Zero Waste Home', 'url': '#'},
                    {'type': 'course', 'name': 'Zero Waste Certification', 'url': '#'}
                ],
                verification_methods=['quiz', 'project', 'portfolio_review']
            ),
            'composting_master': Skill(
                skill_id='composting_master',
                name='Composting Master',
                category=SkillCategory.WASTE_REDUCTION,
                description='Expertise in all forms of composting',
                level=SkillLevel.INTERMEDIATE,
                points=80,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Composting 101', 'url': '#'},
                    {'type': 'video', 'name': 'Advanced Composting Techniques', 'url': '#'}
                ],
                verification_methods=['practical_demonstration', 'project']
            ),
            
            # Water Conservation Skills
            'water_harvesting': Skill(
                skill_id='water_harvesting',
                name='Rainwater Harvesting Specialist',
                category=SkillCategory.WATER_CONSERVATION,
                description='Design and implementation of rainwater harvesting systems',
                level=SkillLevel.INTERMEDIATE,
                points=110,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Rainwater Harvesting Design', 'url': '#'},
                    {'type': 'tool', 'name': 'Water Harvesting Calculator', 'url': '#'}
                ],
                verification_methods=['exam', 'project', 'practical_demonstration']
            ),
            'greywater_systems': Skill(
                skill_id='greywater_systems',
                name='Greywater Systems Expert',
                category=SkillCategory.WATER_CONSERVATION,
                description='Design and installation of greywater recycling systems',
                level=SkillLevel.ADVANCED,
                points=130,
                prerequisites=['water_harvesting'],
                learning_resources=[
                    {'type': 'course', 'name': 'Greywater Systems Design', 'url': '#'},
                    {'type': 'book', 'name': 'Greywater Reuse Guide', 'url': '#'}
                ],
                verification_methods=['exam', 'practical_demonstration']
            ),
            
            # Sustainable Transport Skills
            'eco_driving': Skill(
                skill_id='eco_driving',
                name='Eco-Driving Specialist',
                category=SkillCategory.SUSTAINABLE_TRANSPORT,
                description='Expertise in fuel-efficient and eco-friendly driving techniques',
                level=SkillLevel.BEGINNER,
                points=60,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Eco-Driving Techniques', 'url': '#'},
                    {'type': 'app', 'name': 'Eco-Drive Coach', 'url': '#'}
                ],
                verification_methods=['quiz', 'practical_demonstration']
            ),
            'sustainable_urban_planning': Skill(
                skill_id='sustainable_urban_planning',
                name='Sustainable Urban Planning',
                category=SkillCategory.SUSTAINABLE_TRANSPORT,
                description='Planning sustainable transportation infrastructure',
                level=SkillLevel.EXPERT,
                points=200,
                prerequisites=['eco_driving'],
                learning_resources=[
                    {'type': 'course', 'name': 'Urban Planning for Sustainability', 'url': '#'},
                    {'type': 'book', 'name': 'Sustainable Cities', 'url': '#'}
                ],
                verification_methods=['exam', 'project', 'portfolio_review']
            ),
            
            # Sustainable Food Skills
            'plant_based_nutrition': Skill(
                skill_id='plant_based_nutrition',
                name='Plant-Based Nutrition Specialist',
                category=SkillCategory.SUSTAINABLE_FOOD,
                description='Expertise in plant-based nutrition and meal planning',
                level=SkillLevel.INTERMEDIATE,
                points=90,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Plant-Based Nutrition', 'url': '#'},
                    {'type': 'book', 'name': 'Plant-Based Nutrition Guide', 'url': '#'}
                ],
                verification_methods=['quiz', 'project', 'certification']
            ),
            'urban_farming': Skill(
                skill_id='urban_farming',
                name='Urban Farming Expert',
                category=SkillCategory.SUSTAINABLE_FOOD,
                description='Skills in urban agriculture and vertical farming',
                level=SkillLevel.ADVANCED,
                points=140,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Urban Farming Methods', 'url': '#'},
                    {'type': 'video', 'name': 'Vertical Farming Techniques', 'url': '#'}
                ],
                verification_methods=['project', 'practical_demonstration']
            ),
            
            # Green Building Skills
            'leed_certification': Skill(
                skill_id='leed_certification',
                name='LEED Certification Specialist',
                category=SkillCategory.GREEN_BUILDING,
                description='Expertise in LEED certification process',
                level=SkillLevel.ADVANCED,
                points=180,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'LEED Certification Training', 'url': '#'},
                    {'type': 'book', 'name': 'LEED Reference Guide', 'url': '#'}
                ],
                verification_methods=['exam', 'project', 'certification']
            ),
            'green_architecture': Skill(
                skill_id='green_architecture',
                name='Green Architecture Designer',
                category=SkillCategory.GREEN_BUILDING,
                description='Sustainable building design and architecture',
                level=SkillLevel.EXPERT,
                points=220,
                prerequisites=['leed_certification'],
                learning_resources=[
                    {'type': 'course', 'name': 'Sustainable Architecture', 'url': '#'},
                    {'type': 'book', 'name': 'Green Building Design', 'url': '#'}
                ],
                verification_methods=['portfolio_review', 'project']
            ),
            
            # Carbon Literacy Skills
            'carbon_audit': Skill(
                skill_id='carbon_audit',
                name='Carbon Footprint Auditor',
                category=SkillCategory.CARBON_LITERACY,
                description='Conducting comprehensive carbon footprint assessments',
                level=SkillLevel.INTERMEDIATE,
                points=110,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Carbon Accounting', 'url': '#'},
                    {'type': 'tool', 'name': 'Carbon Calculator Pro', 'url': '#'}
                ],
                verification_methods=['quiz', 'project', 'certification']
            ),
            'ghg_reporting': Skill(
                skill_id='ghg_reporting',
                name='GHG Reporting Specialist',
                category=SkillCategory.CARBON_LITERACY,
                description='Expertise in GHG protocol and emissions reporting',
                level=SkillLevel.ADVANCED,
                points=160,
                prerequisites=['carbon_audit'],
                learning_resources=[
                    {'type': 'course', 'name': 'GHG Protocol Training', 'url': '#'},
                    {'type': 'book', 'name': 'GHG Reporting Guide', 'url': '#'}
                ],
                verification_methods=['exam', 'project']
            ),
            
            # Circular Economy Skills
            'circular_design': Skill(
                skill_id='circular_design',
                name='Circular Economy Designer',
                category=SkillCategory.CIRCULAR_ECONOMY,
                description='Designing products for circular economy',
                level=SkillLevel.ADVANCED,
                points=150,
                prerequisites=[],
                learning_resources=[
                    {'type': 'course', 'name': 'Circular Design Principles', 'url': '#'},
                    {'type': 'book', 'name': 'Circular Economy Handbook', 'url': '#'}
                ],
                verification_methods=['portfolio_review', 'project']
            ),
            'waste_to_resource': Skill(
                skill_id='waste_to_resource',
                name='Waste-to-Resource Specialist',
                category=SkillCategory.CIRCULAR_ECONOMY,
                description='Converting waste streams into valuable resources',
                level=SkillLevel.EXPERT,
                points=190,
                prerequisites=['circular_design'],
                learning_resources=[
                    {'type': 'course', 'name': 'Waste Valorization', 'url': '#'},
                    {'type': 'video', 'name': 'Upcycling Techniques', 'url': '#'}
                ],
                verification_methods=['project', 'practical_demonstration']
            )
        }
    
    def create_skill_instance(self, user_id: int, skill_id: str, 
                            level: SkillLevel = None) -> SkillInstance:
        """
        Create a new skill instance for a user
        
        Args:
            user_id: User identifier
            skill_id: Skill identifier
            level: Desired skill level (default: novice)
            
        Returns:
            SkillInstance object
        """
        if skill_id not in self.skill_templates:
            raise ValueError(f"Skill {skill_id} not found")
        
        template = self.skill_templates[skill_id]
        
        if level is None:
            level = SkillLevel.NOVICE
        
        # Check prerequisites
        if not self._check_prerequisites(user_id, template.prerequisites):
            raise ValueError(f"Prerequisites not met: {template.prerequisites}")
        
        instance_id = str(uuid.uuid4())
        
        skill_instance = SkillInstance(
            instance_id=instance_id,
            skill_id=skill_id,
            user_id=user_id,
            level=level,
            points=template.points,
            progress=0.0,
            verified=False,
            verification_status=VerificationStatus.PENDING,
            verification_data={},
            issued_date=datetime.now(),
            expiry_date=datetime.now() + timedelta(days=template.expiry_days) if template.expiry_days else None,
            last_used=None,
            endorsements=[],
            proof=[],
            notes=[]
        )
        
        # Store the issued skill
        if user_id not in self.issued_skills:
            self.issued_skills[user_id] = []
        self.issued_skills[user_id].append(skill_instance)
        
        # Record transaction
        self.transaction_history.append({
            'type': 'issue',
            'user_id': user_id,
            'skill_id': skill_id,
            'instance_id': instance_id,
            'timestamp': datetime.now().isoformat()
        })
        
        return skill_instance
    
    def _check_prerequisites(self, user_id: int, prerequisites: List[str]) -> bool:
        """Check if user has all prerequisite skills"""
        if not prerequisites:
            return True
        
        user_skills = self.get_user_skills(user_id)
        user_skill_ids = {s.skill_id for s in user_skills if s.is_active()}
        
        return all(prereq in user_skill_ids for prereq in prerequisites)
    
    def get_user_skills(self, user_id: int) -> List[SkillInstance]:
        """Get all skills for a user"""
        return self.issued_skills.get(user_id, [])
    
    def get_skill_template(self, skill_id: str) -> Optional[Skill]:
        """Get skill template by ID"""
        return self.skill_templates.get(skill_id)
    
    def get_skills_by_category(self, category: SkillCategory) -> List[Skill]:
        """Get all skill templates in a category"""
        return [s for s in self.skill_templates.values() if s.category == category]


class SkillWalletCore:
    """
    Core infrastructure for Skill Wallet system
    """
    
    def __init__(self):
        self.minting_system = SkillMintingSystem()
        self.verification_system = SkillVerificationSystem()
        self.wallets = {}
        self.transactions = []
        self.skill_analytics = defaultdict(lambda: {
            'total_issued': 0,
            'total_verified': 0,
            'total_rejected': 0,
            'avg_progress': 0
        })
        
    def create_wallet(self, user_id: int) -> SkillWallet:
        """
        Create a new skill wallet for a user
        
        Args:
            user_id: User identifier
            
        Returns:
            SkillWallet object
        """
        if user_id in self.wallets:
            raise ValueError(f"Wallet already exists for user {user_id}")
        
        wallet = SkillWallet(
            wallet_id=str(uuid.uuid4()),
            user_id=user_id,
            skills={},
            total_points=0,
            level=1,
            badges=set(),
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.wallets[user_id] = wallet
        return wallet
    
    def get_wallet(self, user_id: int) -> Optional[SkillWallet]:
        """Get user's skill wallet"""
        return self.wallets.get(user_id)
    
    def mint_skill(self, user_id: int, skill_id: str, 
                  level: SkillLevel = None,
                  verification_method: str = None,
                  evidence: Dict = None) -> Dict:
        """
        Mint a new skill for a user with optional verification
        
        Args:
            user_id: User identifier
            skill_id: Skill identifier
            level: Skill level
            verification_method: Method to verify the skill
            evidence: Evidence for verification
            
        Returns:
            Dictionary with minting results
        """
        # Ensure wallet exists
        if user_id not in self.wallets:
            self.create_wallet(user_id)
        
        try:
            # Create skill instance
            skill_instance = self.minting_system.create_skill_instance(
                user_id, skill_id, level
            )
            
            # Store in wallet
            self.wallets[user_id].skills[skill_instance.instance_id] = skill_instance
            self.wallets[user_id].updated_at = datetime.now()
            
            result = {
                'success': True,
                'message': 'Skill minted successfully',
                'instance_id': skill_instance.instance_id,
                'skill_id': skill_id,
                'level': skill_instance.level.name
            }
            
            # Verify if requested
            if verification_method and evidence:
                verified, message = self.verification_system.verify_skill(
                    skill_instance, verification_method, evidence
                )
                result['verified'] = verified
                result['verification_message'] = message
                
                # Update wallet points
                if verified:
                    self.wallets[user_id].total_points += skill_instance.points
                    self._update_wallet_level(user_id)
                    self._check_wallet_badges(user_id)
            
            # Track analytics
            self.skill_analytics[skill_id]['total_issued'] += 1
            
            return result
            
        except Exception as e:
            return {
                'success': False,
                'message': f'Failed to mint skill: {str(e)}'
            }
    
    def verify_skill(self, user_id: int, instance_id: str,
                    verification_method: str,
                    evidence: Dict) -> Dict:
        """
        Verify a skill in the user's wallet
        
        Args:
            user_id: User identifier
            instance_id: Skill instance identifier
            verification_method: Method to verify
            evidence: Verification evidence
            
        Returns:
            Verification result
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            return {'success': False, 'message': 'Wallet not found'}
        
        if instance_id not in wallet.skills:
            return {'success': False, 'message': 'Skill not found in wallet'}
        
        skill_instance = wallet.skills[instance_id]
        
        # Perform verification
        verified, message = self.verification_system.verify_skill(
            skill_instance, verification_method, evidence
        )
        
        # Update wallet if verified
        if verified:
            wallet.total_points += skill_instance.points
            self._update_wallet_level(user_id)
            self._check_wallet_badges(user_id)
            
            # Track analytics
            self.skill_analytics[skill_instance.skill_id]['total_verified'] += 1
        else:
            self.skill_analytics[skill_instance.skill_id]['total_rejected'] += 1
        
        wallet.updated_at = datetime.now()
        
        return {
            'success': True,
            'verified': verified,
            'message': message,
            'skill_id': skill_instance.skill_id,
            'level': skill_instance.level.name
        }
    
    def _update_wallet_level(self, user_id: int):
        """Update wallet level based on total points"""
        wallet = self.get_wallet(user_id)
        if not wallet:
            return
        
        points = wallet.total_points
        
        if points >= 1000:
            wallet.level = 6
        elif points >= 500:
            wallet.level = 5
        elif points >= 300:
            wallet.level = 4
        elif points >= 200:
            wallet.level = 3
        elif points >= 100:
            wallet.level = 2
        else:
            wallet.level = 1
    
    def _check_wallet_badges(self, user_id: int):
        """Check and award badges based on skills"""
        wallet = self.get_wallet(user_id)
        if not wallet:
            return
        
        skills = list(wallet.skills.values())
        verified_skills = [s for s in skills if s.verified]
        
        # Skill count badges
        if len(verified_skills) >= 20:
            wallet.badges.add('Master of Sustainability')
        elif len(verified_skills) >= 10:
            wallet.badges.add('Sustainability Expert')
        elif len(verified_skills) >= 5:
            wallet.badges.add('Sustainability Enthusiast')
        
        # Category badges
        categories = defaultdict(int)
        for skill in verified_skills:
            template = self.minting_system.get_skill_template(skill.skill_id)
            if template:
                categories[template.category.value] += 1
        
        for category, count in categories.items():
            if count >= 3:
                wallet.badges.add(f'Multi-{category.replace("_", " ").title()} Expert')
        
        # Points badges
        if wallet.total_points >= 1000:
            wallet.badges.add('Legendary Achiever')
        elif wallet.total_points >= 500:
            wallet.badges.add('Elite Achiever')
        elif wallet.total_points >= 200:
            wallet.badges.add('Achiever')
    
    def get_wallet_summary(self, user_id: int) -> Dict:
        """
        Get comprehensive wallet summary
        
        Args:
            user_id: User identifier
            
        Returns:
            Wallet summary dictionary
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            return {'error': 'Wallet not found'}
        
        skills = list(wallet.skills.values())
        verified_skills = [s for s in skills if s.verified]
        pending_skills = [s for s in skills if s.verification_status == VerificationStatus.PENDING]
        expired_skills = [s for s in skills if s.is_expired()]
        
        # Group by category
        category_skills = defaultdict(list)
        for skill in verified_skills:
            template = self.minting_system.get_skill_template(skill.skill_id)
            if template:
                category_skills[template.category.value].append(skill)
        
        # Calculate skill distribution by level
        level_distribution = defaultdict(int)
        for skill in verified_skills:
            level_distribution[skill.level.name] += 1
        
        return {
            'wallet_id': wallet.wallet_id,
            'user_id': user_id,
            'level': wallet.level,
            'total_points': wallet.total_points,
            'badges': list(wallet.badges),
            'total_skills': len(skills),
            'verified_skills': len(verified_skills),
            'pending_skills': len(pending_skills),
            'expired_skills': len(expired_skills),
            'category_distribution': dict(category_skills),
            'level_distribution': dict(level_distribution),
            'skills': [
                {
                    'instance_id': s.instance_id,
                    'skill_id': s.skill_id,
                    'level': s.level.name,
                    'points': s.points,
                    'progress': s.progress,
                    'verified': s.verified,
                    'expiry': s.expiry_date.isoformat() if s.expiry_date else None
                }
                for s in skills
            ],
            'created_at': wallet.created_at.isoformat(),
            'updated_at': wallet.updated_at.isoformat()
        }
    
    def get_skill_recommendations(self, user_id: int, max_recommendations: int = 5) -> List[Dict]:
        """
        Recommend skills based on user's current skills and interests
        
        Args:
            user_id: User identifier
            max_recommendations: Maximum recommendations to return
            
        Returns:
            List of recommended skills
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            return []
        
        user_skills = set(wallet.skills.keys())
        
        # Get all skill templates
        all_skills = self.minting_system.skill_templates.values()
        
        # Score each skill
        recommendations = []
        for skill in all_skills:
            if skill.skill_id in user_skills:
                continue
            
            # Check prerequisites
            if not self.minting_system._check_prerequisites(user_id, skill.prerequisites):
                continue
            
            # Calculate recommendation score
            score = 0
            
            # Prerequisites met
            if skill.prerequisites:
                score += 20
            
            # Category alignment (if user has skills in similar category)
            user_categories = set()
            for s_id in user_skills:
                template = self.minting_system.get_skill_template(s_id)
                if template:
                    user_categories.add(template.category)
            
            if skill.category in user_categories:
                score += 15
            
            # Skill level progression
            if skill.level in [SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED]:
                if len(user_skills) >= 3:
                    score += 10
            
            # Points value
            score += skill.points / 20
            
            recommendations.append({
                'skill_id': skill.skill_id,
                'name': skill.name,
                'category': skill.category.value,
                'level': skill.level.name,
                'points': skill.points,
                'prerequisites': skill.prerequisites,
                'score': score
            })
        
        # Sort by score and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:max_recommendations]
    
    def get_skill_analytics(self, skill_id: str = None) -> Dict:
        """
        Get analytics for skills
        
        Args:
            skill_id: Optional specific skill ID
            
        Returns:
            Analytics dictionary
        """
        if skill_id:
            return dict(self.skill_analytics[skill_id])
        
        # Aggregate analytics
        total_issued = 0
        total_verified = 0
        total_rejected = 0
        
        for analytics in self.skill_analytics.values():
            total_issued += analytics['total_issued']
            total_verified += analytics['total_verified']
            total_rejected += analytics['total_rejected']
        
        return {
            'total_skills_minted': total_issued,
            'total_skills_verified': total_verified,
            'total_skills_rejected': total_rejected,
            'verification_rate': (total_verified / total_issued * 100) if total_issued > 0 else 0,
            'per_skill': dict(self.skill_analytics)
        }
    
    def transfer_skill(self, from_user_id: int, to_user_id: int, 
                      instance_id: str, reason: str = None) -> Dict:
        """
        Transfer a skill from one user to another (e.g., mentorship)
        
        Args:
            from_user_id: Source user
            to_user_id: Target user
            instance_id: Skill instance to transfer
            reason: Transfer reason
            
        Returns:
            Transfer result
        """
        from_wallet = self.get_wallet(from_user_id)
        to_wallet = self.get_wallet(to_user_id)
        
        if not from_wallet or not to_wallet:
            return {'success': False, 'message': 'Wallet not found'}
        
        if instance_id not in from_wallet.skills:
            return {'success': False, 'message': 'Skill not found in source wallet'}
        
        skill_instance = from_wallet.skills[instance_id]
        
        # Remove from source wallet
        del from_wallet.skills[instance_id]
        from_wallet.total_points -= skill_instance.points
        from_wallet.updated_at = datetime.now()
        self._update_wallet_level(from_user_id)
        
        # Add to target wallet
        new_instance_id = str(uuid.uuid4())
        skill_instance.instance_id = new_instance_id
        skill_instance.user_id = to_user_id
        skill_instance.issued_date = datetime.now()
        skill_instance.notes.append(f"Transferred from user {from_user_id}. Reason: {reason}")
        
        to_wallet.skills[new_instance_id] = skill_instance
        to_wallet.total_points += skill_instance.points
        to_wallet.updated_at = datetime.now()
        self._update_wallet_level(to_user_id)
        
        # Record transaction
        self.transactions.append({
            'type': 'transfer',
            'from_user': from_user_id,
            'to_user': to_user_id,
            'instance_id': instance_id,
            'new_instance_id': new_instance_id,
            'reason': reason,
            'timestamp': datetime.now().isoformat()
        })
        
        return {
            'success': True,
            'message': 'Skill transferred successfully',
            'new_instance_id': new_instance_id
        }
    
    def endorse_skill(self, user_id: int, instance_id: str, 
                     endorser_id: int, comment: str) -> Dict:
        """
        Endorse someone's skill
        
        Args:
            user_id: Owner of the skill
            instance_id: Skill instance to endorse
            endorser_id: Person endorsing
            comment: Endorsement comment
            
        Returns:
            Endorsement result
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            return {'success': False, 'message': 'Wallet not found'}
        
        if instance_id not in wallet.skills:
            return {'success': False, 'message': 'Skill not found'}
        
        skill_instance = wallet.skills[instance_id]
        
        # Check if already endorsed
        if any(e['endorser_id'] == endorser_id for e in skill_instance.endorsements):
            return {'success': False, 'message': 'Already endorsed by this user'}
        
        # Add endorsement
        skill_instance.endorsements.append({
            'endorser_id': endorser_id,
            'comment': comment,
            'timestamp': datetime.now().isoformat()
        })
        
        wallet.updated_at = datetime.now()
        
        return {
            'success': True,
            'message': 'Skill endorsed successfully',
            'endorsement_count': len(skill_instance.endorsements)
        }
    
    def save_state(self, filename: str = 'skill_wallet_state.pkl'):
        """Save the entire state to file"""
        with open(filename, 'wb') as f:
            pickle.dump({
                'wallets': self.wallets,
                'minting_system': self.minting_system,
                'verification_system': self.verification_system,
                'transactions': self.transactions,
                'skill_analytics': dict(self.skill_analytics)
            }, f)
    
    def load_state(self, filename: str = 'skill_wallet_state.pkl'):
        """Load state from file"""
        with open(filename, 'rb') as f:
            data = pickle.load(f)
            self.wallets = data['wallets']
            self.minting_system = data['minting_system']
            self.verification_system = data['verification_system']
            self.transactions = data['transactions']
            self.skill_analytics = defaultdict(lambda: {
                'total_issued': 0,
                'total_verified': 0,
                'total_rejected': 0,
                'avg_progress': 0
            })
            self.skill_analytics.update(data['skill_analytics'])


# Integration with existing systems
class IntegratedSustainabilitySystem:
    """
    Full integration of Skill Wallet with Sustainability Recommendations and Challenges
    """
    
    def __init__(self):
        self.recommender = EnhancedSustainabilityRecommender()
        self.skill_wallet = SkillWalletCore()
        self.skill_to_challenge_mapping = self._create_skill_challenge_mapping()
        
    def _create_skill_challenge_mapping(self) -> Dict:
        """Map skills to challenges and actions"""
        return {
            'energy_audit': ['d1', 'w3', 'm1'],
            'solar_installation': ['w3', 'm1'],
            'zero_waste_expert': ['d3', 'w1', 'm1'],
            'composting_master': ['d3', 'w1'],
            'water_harvesting': ['d2', 'w2'],
            'eco_driving': ['d2', 'w2'],
            'plant_based_nutrition': ['d1', 'w1'],
            'carbon_audit': ['w3', 'm2'],
            'leed_certification': ['w3', 'm1']
        }
    
    def complete_challenge_and_earn_skill(self, user_id: int, 
                                        challenge_id: str) -> Dict:
        """
        Complete a challenge and potentially earn a skill
        
        Args:
            user_id: User identifier
            challenge_id: Challenge identifier
            
        Returns:
            Result with skill earned if applicable
        """
        # Complete the challenge
        challenge_result = self.recommender.complete_challenge(user_id, challenge_id)
        
        # Check if challenge completion should earn a skill
        skill_earned = None
        for skill_id, challenge_ids in self.skill_to_challenge_mapping.items():
            if challenge_id in challenge_ids:
                # Check if user already has this skill
                wallet = self.skill_wallet.get_wallet(user_id)
                if wallet:
                    user_skills = wallet.skills.values()
                    if not any(s.skill_id == skill_id for s in user_skills):
                        # Mint the skill
                        result = self.skill_wallet.mint_skill(
                            user_id, skill_id, 
                            level=SkillLevel.BEGINNER,
                            verification_method='quiz',
                            evidence={'score': 90, 'required_score': 80}
                        )
                        if result['success']:
                            skill_earned = skill_id
        
        return {
            'challenge_result': challenge_result,
            'skill_earned': skill_earned
        }
    
    def log_eco_action_and_earn_skill(self, user_id: int, 
                                     action_name: str) -> Dict:
        """
        Log eco action and potentially earn skill progress
        
        Args:
            user_id: User identifier
            action_name: Eco action name
            
        Returns:
            Result with skill progress if applicable
        """
        # Log the action
        action_result = self.recommender.log_eco_action(user_id, action_name)
        
        # Update skill progress for related skills
        skill_updates = []
        wallet = self.skill_wallet.get_wallet(user_id)
        
        if wallet:
            for skill_instance in wallet.skills.values():
                # Check if action relates to this skill
                template = self.skill_wallet.minting_system.get_skill_template(
                    skill_instance.skill_id
                )
                if template and template.category.value in action_result['category']:
                    # Update progress
                    skill_instance.progress = min(100, skill_instance.progress + 5)
                    skill_updates.append({
                        'skill_id': skill_instance.skill_id,
                        'progress': skill_instance.progress
                    })
                    
                    # Auto-verify if progress reaches 100
                    if skill_instance.progress >= 100 and not skill_instance.verified:
                        self.skill_wallet.verify_skill(
                            user_id,
                            skill_instance.instance_id,
                            'portfolio_review',
                            {'completeness': 90, 'quality_rating': 85}
                        )
        
        return {
            'action_result': action_result,
            'skill_updates': skill_updates
        }
    
    def get_unified_dashboard(self, user_id: int) -> Dict:
        """
        Get unified dashboard with all systems
        
        Args:
            user_id: User identifier
            
        Returns:
            Complete dashboard
        """
        # Get recommendations dashboard
        recommendations = self.recommender.get_dashboard(user_id)
        
        # Get skill wallet
        wallet_summary = self.skill_wallet.get_wallet_summary(user_id)
        
        # Get skill recommendations
        skill_recommendations = self.skill_wallet.get_skill_recommendations(user_id)
        
        return {
            'user_id': user_id,
            'sustainability': recommendations,
            'wallet': wallet_summary,
            'skill_recommendations': skill_recommendations
        }


# Example usage
def main():
    """Example usage of the Skill Wallet Core Infrastructure"""
    
    # Initialize integrated system
    integrated_system = IntegratedSustainabilitySystem()
    user_id = 1
    
    print("=" * 60)
    print("SKILL WALLET CORE INFRASTRUCTURE DEMO")
    print("=" * 60)
    
    # 1. Create wallet
    print("\n1. Creating Skill Wallet...")
    wallet = integrated_system.skill_wallet.create_wallet(user_id)
    print(f"✅ Wallet created: {wallet.wallet_id}")
    print(f"   User: {user_id}")
    print(f"   Created: {wallet.created_at}")
    
    # 2. Mint some skills
    print("\n2. Minting Skills...")
    skills_to_mint = ['energy_audit', 'composting_master', 'eco_driving']
    
    for skill_id in skills_to_mint:
        result = integrated_system.skill_wallet.mint_skill(
            user_id, skill_id,
            verification_method='quiz',
            evidence={'score': 85, 'required_score': 80}
        )
        
        if result['success']:
            print(f"✅ Minted: {skill_id}")
            print(f"   Level: {result['level']}")
            print(f"   Verified: {result.get('verified', False)}")
        else:
            print(f"❌ Failed: {result['message']}")
    
    # 3. Log eco actions to progress skills
    print("\n3. Logging Eco Actions...")
    actions = ['biking', 'recycling', 'turning_off_lights', 'eating_plant_based']
    
    for action in actions[:3]:
        result = integrated_system.log_eco_action_and_earn_skill(user_id, action)
        print(f"   {action}: Progress updated")
        if result['skill_updates']:
            for update in result['skill_updates']:
                print(f"      {update['skill_id']}: {update['progress']}%")
    
    # 4. Complete challenge and earn skill
    print("\n4. Completing Challenge...")
    result = integrated_system.complete_challenge_and_earn_skill(
        user_id, 'd1'  # Meatless Monday
    )
    print(f"   Challenge completed")
    if result['skill_earned']:
        print(f"   🎉 Earned new skill: {result['skill_earned']}")
    
    # 5. Endorse a skill
    print("\n5. Endorsing a Skill...")
    wallet_data = integrated_system.skill_wallet.get_wallet(user_id)
    if wallet_data and 'skills' in wallet_data and wallet_data['skills']:
        first_skill = wallet_data['skills'][0]['instance_id']
        result = integrated_system.skill_wallet.endorse_skill(
            user_id, first_skill, 
            endorser_id=2, 
            comment="Great work on this sustainability skill!"
        )
        if result['success']:
            print(f"   ✅ Skill endorsed")
            print(f"   Endorsements: {result['endorsement_count']}")
    
    # 6. Get wallet summary
    print("\n6. Wallet Summary:")
    summary = integrated_system.skill_wallet.get_wallet_summary(user_id)
    print(f"   Level: {summary['level']}")
    print(f"   Total Points: {summary['total_points']}")
    print(f"   Verified Skills: {summary['verified_skills']}")
    print(f"   Badges: {', '.join(summary['badges']) if summary['badges'] else 'None'}")
    print(f"   Skills: {len(summary['skills'])}")
    
    # 7. Get skill recommendations
    print("\n7. Skill Recommendations:")
    recommendations = integrated_system.skill_wallet.get_skill_recommendations(user_id)
    for rec in recommendations[:3]:
        print(f"   • {rec['name']} ({rec['category']})")
        print(f"     Points: {rec['points']} | Level: {rec['level']}")
        if rec['prerequisites']:
            print(f"     Prerequisites: {', '.join(rec['prerequisites'])}")
    
    # 8. Get unified dashboard
    print("\n8. Unified Dashboard:")
    dashboard = integrated_system.get_unified_dashboard(user_id)
    print(f"   User: {dashboard['user_id']}")
    print(f"   Wallet Level: {dashboard['wallet']['level']}")
    print(f"   Sustainability Score: {dashboard['sustainability']['user_profile']['sustainability_score']:.2f}")
    print(f"   Total Points: {dashboard['wallet']['total_points']}")
    print(f"   Badges Earned: {len(dashboard['wallet']['badges'])}")
    
    # 9. Get analytics
    print("\n9. Skill Analytics:")
    analytics = integrated_system.skill_wallet.get_skill_analytics()
    print(f"   Total Skills Minted: {analytics['total_skills_minted']}")
    print(f"   Total Skills Verified: {analytics['total_skills_verified']}")
    print(f"   Verification Rate: {analytics['verification_rate']:.1f}%")
    
    # 10. Save state
    print("\n10. Saving State...")
    integrated_system.skill_wallet.save_state('skill_wallet_state.pkl')
    print("   ✅ State saved to 'skill_wallet_state.pkl'")
    
    print("\n" + "=" * 60)
    print("DEMO COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
