import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthLayout() {
    const location = useLocation();
    const outlet = useOutlet();

    const pageVariants = {
        initial: { opacity: 0, y: 40 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { type: "tween", ease: "easeIn", duration: 0.35 },
        },
        exit: {
            opacity: 0,
            y: -40,
            transition: { type: "tween", ease: "easeOut", duration: 0.35 },
        },
    };

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.key}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {outlet}
            </motion.div>
        </AnimatePresence>
    );
}
