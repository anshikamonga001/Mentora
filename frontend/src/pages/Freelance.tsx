import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Search,
  Filter,
  DollarSign,
  Clock,
  MapPin,
  Star,
  Eye,
  MessageCircle,
  Briefcase,
  Calendar,
  User,
  Award,
  TrendingUp,
  ChevronDown,
  X,
  Send,
  Bookmark,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BidModal from '../components/freelance/BidModal';

const FreelanceContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: calc(68px + ${({ theme }) => theme.spacing.xl}) ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
`;

const FreelanceContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const PostProjectButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  color: ${({ theme, $active }) => $active ? theme.colors.primary[600] : theme.colors.gray[600]};
  font-weight: ${({ theme, $active }) => $active ? theme.fontWeights.semibold : theme.fontWeights.medium};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary[500] : 'transparent'};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SearchAndFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.sm} 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const ProjectsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProjectInfo = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ProjectBudget = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.success[600]};
`;

const ProjectActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ProjectDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProjectSkills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Skill = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const ProjectFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ProjectStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const BidButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
  }
`;

const ClientInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ClientAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.secondary[500]});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  flex-shrink: 0;
`;

const ClientDetails = styled.div`
  flex: 1;
`;

const ClientName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 2px;
`;

const ClientRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RatingStars = styled.div`
  display: flex;
  gap: 2px;
`;

const RatingText = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-height: 120px;
  resize: vertical;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  background: white;
  transition: all ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const MyProjectCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ProjectStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme, status }) => 
    status === 'Completed' ? theme.colors.success[100] :
    status === 'In Progress' ? theme.colors.warning[100] :
    theme.colors.gray[100]
  };
  color: ${({ theme, status }) => 
    status === 'Completed' ? theme.colors.success[700] :
    status === 'In Progress' ? theme.colors.warning[700] :
    theme.colors.gray[700]
  };
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width 0.3s ease;
`;

const ProposalStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ theme, status }) => 
    status === 'Accepted' ? theme.colors.success[100] :
    status === 'Under Review' ? theme.colors.warning[100] :
    status === 'Rejected' ? theme.colors.error[100] :
    theme.colors.gray[100]
  };
  color: ${({ theme, status }) => 
    status === 'Accepted' ? theme.colors.success[700] :
    status === 'Under Review' ? theme.colors.warning[700] :
    status === 'Rejected' ? theme.colors.error[700] :
    theme.colors.gray[700]
  };
`;

const BidAmount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SkillTag = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const mockProjects = [
    {
      id: 1,
      title: "Build a Modern E-commerce Website with React and Node.js",
      description: "Looking for an experienced full-stack developer to build a complete e-commerce platform. The project includes user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Must be responsive and SEO-friendly.",
      budget: { min: 2000, max: 3500 },
      timeline: "2-3 months",
      skills: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
      client: { name: "Sarah Johnson", rating: 4.8, reviews: 23, avatar: "SJ" },
      stats: { proposals: 12, views: 89 },
      postedTime: "2 days ago",
      location: "Remote"
    },
    {
      id: 2,
      title: "Mobile App Development for Food Delivery Service",
      description: "Need a React Native developer to create a food delivery app similar to UberEats. Features include restaurant listings, menu browsing, order tracking, payment processing, and delivery management.",
      budget: { min: 3000, max: 5000 },
      timeline: "3-4 months",
      skills: ["React Native", "Firebase", "Google Maps API", "Payment Gateway"],
      client: { name: "Mike Chen", rating: 4.9, reviews: 45, avatar: "MC" },
      stats: { proposals: 8, views: 156 },
      postedTime: "1 day ago",
      location: "New York, NY"
    },
    {
      id: 3,
      title: "Data Analysis and Visualization Dashboard",
      description: "Seeking a data scientist to create an interactive dashboard for business analytics. The project involves data cleaning, analysis, and creating visualizations using Python and modern web technologies.",
      budget: { min: 1500, max: 2500 },
      timeline: "1-2 months",
      skills: ["Python", "Pandas", "D3.js", "React", "SQL"],
      client: { name: "Emily Rodriguez", rating: 4.7, reviews: 31, avatar: "ER" },
      stats: { proposals: 15, views: 203 },
      postedTime: "3 days ago",
      location: "Remote"
    },
    {
      id: 4,
      title: "WordPress Website Redesign and Optimization",
      description: "Looking to redesign an existing WordPress website with modern UI/UX, improve page speed, and implement SEO best practices. The site needs to be mobile-responsive and user-friendly.",
      budget: { min: 800, max: 1200 },
      timeline: "3-4 weeks",
      skills: ["WordPress", "PHP", "CSS", "JavaScript", "SEO"],
      client: { name: "David Kim", rating: 4.6, reviews: 18, avatar: "DK" },
      stats: { proposals: 22, views: 134 },
      postedTime: "5 days ago",
      location: "Los Angeles, CA"
    }
  ];

  const mockMyProjects = [
    {
      id: 101,
      title: "React Dashboard for Analytics Platform",
      description: "Building a comprehensive analytics dashboard with real-time data visualization and user management features.",
      budget: { min: 1800, max: 2200 },
      timeline: "6 weeks",
      skills: ["React", "TypeScript", "D3.js", "Node.js"],
      status: "In Progress",
      client: { name: "TechCorp Inc.", rating: 4.9, reviews: 67, avatar: "TC" },
      progress: 65,
      deadline: "Dec 15, 2024",
      earnings: 1400,
      postedTime: "2 weeks ago"
    },
    {
      id: 102,
      title: "Mobile App UI/UX Design",
      description: "Complete UI/UX design for a fitness tracking mobile application with modern design principles.",
      budget: { min: 1200, max: 1500 },
      timeline: "4 weeks",
      skills: ["Figma", "UI/UX", "Mobile Design", "Prototyping"],
      status: "Completed",
      client: { name: "FitLife Studios", rating: 4.7, reviews: 34, avatar: "FL" },
      progress: 100,
      deadline: "Nov 30, 2024",
      earnings: 1500,
      postedTime: "1 month ago"
    }
  ];

  const mockMyProposals = [
    {
      id: 201,
      title: "E-learning Platform Development",
      description: "Full-stack development of an online learning platform with video streaming and progress tracking.",
      budget: { min: 3000, max: 4500 },
      timeline: "3-4 months",
      skills: ["React", "Node.js", "MongoDB", "Video Streaming"],
      client: { name: "EduTech Solutions", rating: 4.8, reviews: 45, avatar: "ET" },
      proposalStatus: "Under Review",
      bidAmount: 3800,
      submittedDate: "3 days ago",
      coverLetter: "I have extensive experience in building e-learning platforms..."
    },
    {
      id: 202,
      title: "Blockchain Integration for Supply Chain",
      description: "Integrate blockchain technology for supply chain transparency and tracking.",
      budget: { min: 5000, max: 7000 },
      timeline: "4-5 months",
      skills: ["Blockchain", "Solidity", "Web3", "React"],
      client: { name: "Supply Chain Pro", rating: 4.6, reviews: 28, avatar: "SC" },
      proposalStatus: "Rejected",
      bidAmount: 5500,
      submittedDate: "1 week ago",
      coverLetter: "With my blockchain expertise and previous supply chain projects..."
    },
    {
      id: 203,
      title: "AI-Powered Chatbot Development",
      description: "Develop an intelligent chatbot with natural language processing capabilities.",
      budget: { min: 2500, max: 3500 },
      timeline: "2-3 months",
      skills: ["Python", "NLP", "TensorFlow", "API Integration"],
      client: { name: "ChatBot Innovations", rating: 4.9, reviews: 56, avatar: "CI" },
      proposalStatus: "Accepted",
      bidAmount: 3200,
      submittedDate: "5 days ago",
      coverLetter: "I specialize in AI and machine learning solutions..."
    }
  ];

const Freelance: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProjects(mockProjects);
    } else {
      const filtered = mockProjects.filter(project =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase()) ||
        project.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        project.client.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    timeline: '',
    skills: '',
    category: ''
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        fill={index < Math.floor(rating) ? '#F59E0B' : 'none'}
        color={index < Math.floor(rating) ? '#F59E0B' : '#D1D5DB'}
      />
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePostProject = () => {
    if (!user) {
      alert('Please log in to post a project');
      return;
    }

    if (!projectForm.title || !projectForm.description || !projectForm.budget || !projectForm.timeline) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new project object
    const newProject = {
      id: mockProjects.length + 1,
      title: projectForm.title,
      description: projectForm.description,
      budget: {
        min: parseInt(projectForm.budget.split('-')[0].replace(/[^0-9]/g, '')) || 0,
        max: parseInt(projectForm.budget.split('-')[1]?.replace(/[^0-9]/g, '')) || 0
      },
      timeline: projectForm.timeline,
      skills: projectForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      client: {
        name: user.name || 'Anonymous',
        rating: 5.0,
        reviews: 0,
        avatar: user.name?.charAt(0).toUpperCase() || 'A'
      },
      stats: { proposals: 0, views: 0 },
      postedTime: 'Just now',
      location: 'Remote'
    };

    // Add to projects list
    mockProjects.unshift(newProject);
    setFilteredProjects([...mockProjects]);

    // Reset form and close modal
    setProjectForm({
      title: '',
      description: '',
      budget: '',
      timeline: '',
      skills: '',
      category: ''
    });
    setShowPostModal(false);
    alert('Project posted successfully!');
  };

  const handleBidOnProject = (project: any) => {
    if (!user) {
      alert('Please log in to submit a proposal');
      return;
    }
    setSelectedProject(project);
    setShowBidModal(true);
  };

  const handleSubmitBid = (bidData: any) => {
    console.log('Submitting bid:', bidData);
    // Here you would typically send the bid to your backend
    setShowBidModal(false);
    setSelectedProject(null);
  };

  const renderBrowseProjects = () => (
    <ProjectsGrid>
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id}>
          <ProjectHeader>
            <ProjectTitle>{project.title}</ProjectTitle>
            <ProjectBudget>
              <DollarSign size={16} />
              ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
            </ProjectBudget>
          </ProjectHeader>
          <ProjectDescription>{project.description}</ProjectDescription>
          <ClientInfo>
            <ClientAvatar>{project.client.avatar}</ClientAvatar>
            <div>
              <ClientName>{project.client.name}</ClientName>
              <ClientRating>
                {renderStars(project.client.rating)} ({project.client.reviews} reviews)
              </ClientRating>
            </div>
          </ClientInfo>
          <SkillsContainer>
            {project.skills.map((skill, index) => (
              <SkillTag key={index}>{skill}</SkillTag>
            ))}
          </SkillsContainer>
          <ProjectMeta>
            <span>Posted {project.postedTime}</span>
            <span>{project.stats.proposals} proposals</span>
          </ProjectMeta>
          <BidButton onClick={(e) => {
            e.preventDefault();
            handleBidOnProject(project);
          }}>
            Submit Proposal
          </BidButton>
        </ProjectCard>
      ))}
    </ProjectsGrid>
  );

  const renderMyProjects = () => {
    if (mockMyProjects.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <EmptyStateTitle>No Projects Posted Yet</EmptyStateTitle>
          <EmptyStateText>
            Start by posting your first project to find talented freelancers.
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <ProjectsGrid>
        {mockMyProjects.map((project) => (
          <MyProjectCard key={project.id}>
            <ProjectHeader>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectStatus status={project.status}>{project.status}</ProjectStatus>
            </ProjectHeader>
            <ProjectDescription>{project.description}</ProjectDescription>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <ProgressBar>
                <ProgressFill progress={project.progress} />
              </ProgressBar>
            </div>
            <ProjectMeta>
              <span>Budget: ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}</span>
              <span>0 proposals received</span>
            </ProjectMeta>
            <ProjectMeta>
              <span>Posted: {project.postedTime}</span>
              <span>Deadline: {project.deadline}</span>
            </ProjectMeta>
          </MyProjectCard>
        ))}
      </ProjectsGrid>
    );
  };

  const renderMyProposals = () => {
    if (mockMyProposals.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>💼</EmptyStateIcon>
          <EmptyStateTitle>No Proposals Submitted Yet</EmptyStateTitle>
          <EmptyStateText>
            Browse available projects and submit your first proposal to get started.
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <ProjectsGrid>
        {mockMyProposals.map((proposal) => (
          <MyProjectCard key={proposal.id}>
            <ProjectHeader>
              <ProjectTitle>{proposal.title}</ProjectTitle>
              <ProposalStatus status={proposal.proposalStatus}>{proposal.proposalStatus}</ProposalStatus>
            </ProjectHeader>
            <ProjectDescription>{proposal.description}</ProjectDescription>
            <div style={{ marginBottom: '15px' }}>
              <BidAmount>Your Bid: ${proposal.bidAmount.toLocaleString()}</BidAmount>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                Timeline: {proposal.timeline}
              </div>
            </div>
            <ProjectMeta>
              <span>Client: {proposal.client.name}</span>
              <span>Submitted: {proposal.submittedDate}</span>
            </ProjectMeta>
            <ProjectMeta>
              <span>Project Budget: ${proposal.budget.min.toLocaleString()} - ${proposal.budget.max.toLocaleString()}</span>
              <span>Status: {proposal.proposalStatus}</span>
            </ProjectMeta>
          </MyProjectCard>
        ))}
      </ProjectsGrid>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'browse':
        return renderBrowseProjects();
      case 'my-projects':
        return renderMyProjects();
      case 'my-proposals':
        return renderMyProposals();
      default:
        return renderBrowseProjects();
    }
  };

  return (
    <FreelanceContainer>
      <FreelanceContent>
        <Header>
          <HeaderLeft>
            <Title>Freelance Board</Title>
            <Subtitle>Find projects or hire talented freelancers</Subtitle>
          </HeaderLeft>
          <PostProjectButton onClick={() => setShowPostModal(true)}>
            <Plus size={20} />
            Post Project
          </PostProjectButton>
        </Header>

        <TabsContainer>
          <Tab $active={activeTab === 'browse'} onClick={() => setActiveTab('browse')}>
            Browse Projects
          </Tab>
          <Tab $active={activeTab === 'my-projects'} onClick={() => setActiveTab('my-projects')}>
            My Projects
          </Tab>
          <Tab $active={activeTab === 'proposals'} onClick={() => setActiveTab('proposals')}>
            My Proposals
          </Tab>
        </TabsContainer>

        {activeTab === 'browse' && (
          <SearchAndFilters>
            <SearchContainer>
              <SearchIcon size={20} />
              <SearchInput
                type="text"
                placeholder="Search projects by title, skills, or keywords..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchContainer>
            <FilterButton>
              <Filter size={16} />
              Filters
              <ChevronDown size={16} />
            </FilterButton>
          </SearchAndFilters>
        )}

        {activeTab === 'browse' && renderBrowseProjects()}
        {activeTab === 'my-projects' && renderMyProjects()}
        {activeTab === 'proposals' && renderMyProposals()}

        <AnimatePresence>
          {showPostModal && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPostModal(false)}
            >
              <ModalContent
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ModalHeader>
                  <ModalTitle>Post a New Project</ModalTitle>
                  <CloseButton onClick={() => setShowPostModal(false)}>
                    <X size={20} />
                  </CloseButton>
                </ModalHeader>

                <FormGroup>
                  <Label>Project Title</Label>
                  <Input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleInputChange}
                    placeholder="What do you need done?"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    name="category"
                    value={projectForm.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="design">Design</option>
                    <option value="data-science">Data Science</option>
                    <option value="marketing">Marketing</option>
                    <option value="writing">Writing</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Project Description</Label>
                  <TextArea
                    name="description"
                    value={projectForm.description}
                    onChange={handleInputChange}
                    placeholder="Describe your project in detail. Include requirements, deliverables, and any specific preferences..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Budget Range</Label>
                  <Input
                    type="text"
                    name="budget"
                    value={projectForm.budget}
                    onChange={handleInputChange}
                    placeholder="e.g. $1000 - $2000"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Timeline</Label>
                  <Input
                    type="text"
                    name="timeline"
                    value={projectForm.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g. 2-3 weeks"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Required Skills</Label>
                  <Input
                    type="text"
                    name="skills"
                    value={projectForm.skills}
                    onChange={handleInputChange}
                    placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                  />
                </FormGroup>

                <SubmitButton
                  onClick={handlePostProject}
                  disabled={!projectForm.title || !projectForm.description}
                >
                  Post Project
                </SubmitButton>
              </ModalContent>
            </Modal>
          )}
        </AnimatePresence>

        <BidModal
          isOpen={showBidModal}
          onClose={() => setShowBidModal(false)}
          projectTitle={selectedProject?.title || ''}
          projectBudget={selectedProject?.budget || { min: 0, max: 0 }}
          onSubmitBid={handleSubmitBid}
        />
      </FreelanceContent>
    </FreelanceContainer>
  );
};

export default Freelance;