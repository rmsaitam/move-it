import { createContext, useState, ReactNode, useEffect } from 'react'
import Cookies from 'js-cookie';
import challenges from '../../challenges.json'
import { LevelUpModal } from '../components/LevelUpModal';

interface ChallengeProviderProps {
    children: ReactNode,
    level: number,
    currentExperience: number,
    challengeCompleted: number
}

interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number,
}

interface ChallengeContextData {
    level: number,
    currentExperience: number,
    challengeCompleted: number,
    activeChallenge: Challenge,
    experienceToNextLevel: number,
    resetChallenge: () => void,
    levelUp: () => void,
    startNewChallenge: () => void,
    completeChallenge: () => void,
    closeLevelUpModal: () => void
}


export const ChallengeContext = createContext({} as ChallengeContextData);

export function ChallengeProvider({ children, ...rest }: ChallengeProviderProps) {
    const [level, setLevel] = useState(rest.level);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience );
    const [challengeCompleted, setChallengeCompleted] = useState(rest.challengeCompleted);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level))
        Cookies.set('currentExperience', String(currentExperience))
        Cookies.set('challengeCompleted', String(challengeCompleted))
    }, [level, currentExperience, challengeCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function startNewChallenge() {

        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`,
                silent: true
            })
            new Audio('/notification.mp3').play();
        }

    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengeCompleted(challengeCompleted + 1);
    }

    return (
        <ChallengeContext.Provider
            value={{
                level,
                currentExperience,
                challengeCompleted,
                activeChallenge,
                experienceToNextLevel,
                resetChallenge,
                levelUp,
                startNewChallenge,
                completeChallenge,
                closeLevelUpModal
            }}
        >
            {children}
            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengeContext.Provider>
    )
}

