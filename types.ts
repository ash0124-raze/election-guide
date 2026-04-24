import { ElectionStep } from './types';

export const ELECTION_STEPS: ElectionStep[] = [
  {
    id: 'registration',
    title: 'Register to Vote',
    description: 'Ensure you are registered at your current address.',
    longDescription: 'Registration is the first and most critical step. Most states require you to register at least 15-30 days before an election. You can often do this online, by mail, or in person at public agencies like the DMV.',
    icon: 'UserCheck',
    estimatedTime: '5-10 mins',
    category: 'Preparation'
  },
  {
    id: 'primaries',
    title: 'Primary Elections',
    description: 'Participate in choosing your party\'s nominees.',
    longDescription: 'Primaries and Caucuses determine which candidates will represent each political party in the general election. Check if your state has "Open" or "Closed" primaries to know if you can vote for any party or just your registered one.',
    icon: 'Search',
    estimatedTime: 'Varies',
    category: 'Participation'
  },
  {
    id: 'research',
    title: 'Research Candidates',
    description: 'Learn about candidates and local ballot measures.',
    longDescription: 'Beyond the big names, local elections affect your daily life directly. Look up non-partisan voter guides, attend town halls, and review the actual text of ballot propositions.',
    icon: 'BookOpen',
    estimatedTime: '1-2 hours',
    category: 'Preparation'
  },
  {
    id: 'plan',
    title: 'Make a Voting Plan',
    description: 'Decide how and when you will cast your ballot.',
    longDescription: 'Will you vote by mail, early in-person, or at your polling place on Election Day? Check your polling location, verify valid forms of ID required by your state, and clear your schedule.',
    icon: 'Calendar',
    estimatedTime: '15 mins',
    category: 'Preparation'
  },
  {
    id: 'general',
    title: 'General Election',
    description: 'Cast your final vote for all offices and measures.',
    longDescription: 'The culmination of the process. In the US, this falls on the Tuesday after the first Monday in November. Ensure you return your mail-in ballot on time or show up before polls close.',
    icon: 'Vote',
    estimatedTime: '20-60 mins',
    category: 'Participation'
  },
  {
    id: 'certification',
    title: 'Certification',
    description: 'Official counting and verification of results.',
    longDescription: 'After Election Day, local and state officials conduct canvas of votes, counting provisionals and late-arriving mail ballots. Once verified, results are officially certified.',
    icon: 'CheckCircle2',
    estimatedTime: 'Weeks',
    category: 'Post-Election'
  }
];
