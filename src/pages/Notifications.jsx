import { Bell } from 'lucide-react';
import { motion } from "framer-motion";
import { useLanguage } from "@/components/auth/LanguageContext";

export default function Notifications() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
          <Bell className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('notifications')}</h1>
        <p className="text-gray-500 text-lg">{t('comingSoon')}</p>
      </motion.div>
    </div>
  );
}
