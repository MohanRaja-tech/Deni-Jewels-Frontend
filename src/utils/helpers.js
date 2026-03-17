// Format price in INR
export const formatPrice = (price) => {
    if (!price && price !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

// Format rate per unit
export const formatRate = (rate, unit = 'gram') => {
    return `${formatPrice(rate)}/${unit === 'carat' ? 'ct' : 'g'}`;
};

// Format date
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

// Format date with time
export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// Get metal type display name
export const getMetalTypeName = (type) => {
    const names = {
        gold: 'Gold',
        silver: 'Silver',
        platinum: 'Platinum',
        diamond: 'Diamond',
    };
    return names[type] || type;
};

// Get rate type display name
export const getRateDisplayName = (type) => {
    const names = {
        gold_22k: '22K Gold',
        gold_24k: '24K Gold',
        silver: 'Silver',
        platinum: 'Platinum',
        diamond: 'Diamond',
    };
    return names[type] || type;
};

// Get category icon/emoji
export const getCategoryEmoji = (category) => {
    const emojis = {
        Rings: '💍',
        Necklaces: '📿',
        Bangles: '⭕',
        Earrings: '✨',
        Bridal: '👰',
    };
    return emojis[category] || '💎';
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Generate star array for rating display
export const getStarArray = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
};

// Validate email
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Get time ago string
export const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(date);
};
