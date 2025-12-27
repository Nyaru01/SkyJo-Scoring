
export const LEVEL_REWARDS = {
    2: {
        type: 'emoji',
        content: '🍪',
        name: 'Cookie Pixel',
        description: 'Un délicieux cookie mi-fondant, mi-pixel. C\'est virtuel, donc 0 calorie !',
        rarity: 'common'
    },
    3: {
        type: 'skin',
        image: '/card-back-papyrus.jpg',
        name: 'Skin Papyrus',
        description: 'Un look rétro-douteux pour vos cartes. L\'histoire s\'écrit... sur votre dos de carte.',
        rarity: 'uncommon'
    },
    4: { type: 'emoji', content: '🎓', name: 'Savant Fou', description: 'Une intelligence supérieure... ou pas.', rarity: 'common' },
    5: {
        type: 'skin',
        image: '/card-back-neon.png',
        name: 'Skin Neon',
        description: 'Cyberpunk attitude. Attention, ne consomme pas d\'électricité réelle.',
        rarity: 'rare'
    },
    6: { type: 'emoji', content: '🎭', name: 'Double Jeu', description: 'Pour ceux qui cachent bien leur jeu.', rarity: 'common' },
    7: { type: 'generic', content: '🎰', name: 'Lucky Seven', description: 'Titre débloqué : La chance tourne !', rarity: 'uncommon' },
    8: { type: 'emoji', content: '🚀', name: 'Vers la Lune', description: 'Votre score décolle... vers le bas on espère.', rarity: 'rare' },
    9: { type: 'generic', content: '🦈', name: 'Card Shark', description: 'Titre débloqué : Prédateur des tables.', rarity: 'rare' },
    10: {
        type: 'skin',
        image: '/card-back-gold.png',
        name: 'Skin Gold',
        description: 'Le luxe ultime. Brille de mille feux (pixels).',
        rarity: 'epic'
    },
    11: { type: 'emoji', content: '👑', name: 'Roi du Skyjo', description: 'La couronne vous va si bien.', rarity: 'epic' },
    12: { type: 'generic', content: '🧙‍♂️', name: 'Grand Master', description: 'Titre débloqué : Vous voyez les chiffres en matrice.', rarity: 'epic' },
    13: { type: 'emoji', content: '💎', name: 'Précieux', description: 'Solide comme un diamant.', rarity: 'legendary' },
    14: { type: 'generic', content: '🏆', name: 'Legend', description: 'Titre débloqué : On parlera de vous dans 100 ans.', rarity: 'legendary' },
    15: {
        type: 'skin',
        image: '/card-back-galaxy.png',
        name: 'Skin Galaxy',
        description: 'L\'univers dans votre main. Littéralement.',
        rarity: 'legendary'
    },
};

/**
 * Helper to get rewards as an array for UI lists
 */
export const getRewardsList = () => {
    return Object.entries(LEVEL_REWARDS).map(([level, reward]) => ({
        level: parseInt(level),
        ...reward,
        // Map types to legacy icon format for ExperienceBar if needed
        icon: reward.type === 'emoji' ? reward.content :
            reward.type === 'skin' ? '🎨' :
                reward.type === 'generic' ? reward.content : '🎁'
    })).sort((a, b) => a.level - b.level);
};
