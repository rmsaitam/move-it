import { useContext } from 'react';
import { ChallengeContext } from '../contexts/ChallengeContext';

import styles from '../styles/components/Profile.module.css';

export function Profile(){

    const {level} = useContext(ChallengeContext);

    return (
        <div className={styles.profileContainer}>
            <img src="https://i.ibb.co/G5g2Smm/3632125.jpg" alt="Reginaldo"/>
            <div>
                <strong>Reginaldo</strong>
                <p>
                    <img src="icons/level.svg" alt="level"/>
                    Level {level}
                </p>
            </div>
        </div>
    );
}