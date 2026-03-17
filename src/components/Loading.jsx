import { motion } from 'framer-motion';

const Loading = ({ text = 'Loading...' }) => {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-12 h-12 border-3 border-primary-200 border-t-primary-500 rounded-full"
                style={{ borderWidth: '3px' }}
            />
            <p className="text-gray-400 text-sm font-medium">{text}</p>
        </div>
    );
};

export default Loading;
