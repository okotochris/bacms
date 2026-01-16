// components/OurClasses.tsx
'use client';

import { motion, easeOut, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Music, Palette, Dribbble, Users, Globe, Trophy, HeartHandshake, Leaf, Award, Brain, Heart, ShieldCheck} from 'lucide-react';

const activities = [
  {
    icon: Music,
    title: "Music & Choir",
    description: "Vocal training, instrumental lessons, and school choir to develop rhythm, creativity, and confidence.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Palette,
    title: "Art & Craft",
    description: "Drawing, painting, sculpture, and crafts that encourage self-expression and fine motor skills.",
    color: "text-pink-600 bg-pink-50",
  },
  {
    icon: Dribbble,
    title: "Sports & Athletics",
    description: "Football, basketball, athletics, table tennis, and inter-house competitions for physical fitness & teamwork.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Users,
    title: "Debate & Public Speaking",
    description: "Junior & senior debating clubs, public speaking workshops, and competitions to build eloquence and critical thinking.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Globe,
    title: "Cultural & Language Club",
    description: "French, Yoruba/Igbo exposure, cultural dances, and international day celebrations to foster global awareness.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: Trophy,
    title: "Scouting & Cadet",
    description: "Boys & Girls Brigade, Scouts, and cadet programs developing leadership, discipline, and community service.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: HeartHandshake,
    title: "Community Service",
    description: "Outreach programs, charity drives, environmental projects, and visits to support local communities.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: Leaf,
    title: "Environmental Club",
    description: "Gardening, recycling initiatives, tree planting, and climate education for responsible stewardship.",
    color: "text-emerald-600 bg-emerald-50",
  },
];


const facilities = [
  {
    title: "Montessori Classrooms",
    description: "Bright, child-centered spaces equipped with authentic Montessori materials for hands-on, joyful learning across all age groups.",
    image: '/classroom.jpg', // ← REPLACE with your photo
  },
  {
    title: "Science Laboratories",
    description: "Well-equipped modern labs for practical experiments in Biology, Chemistry, and Physics, preparing students for WAEC/NECO success.",
    image: '/lab.jpg', // ← REPLACE
  },
  {
    title: "Library & Resource Centre",
    description: "A peaceful haven filled with age-appropriate books, digital resources, and cozy reading corners to foster a lifelong love of reading.",
    image: '/library.jpg', // ← REPLACE
  },
  {
    title: "Spacious Playground",
    description: "Safe, engaging outdoor area with modern play equipment, sports field, and green spaces for physical development and recreation.",
    image: '/playground.jpg', // ← REPLACE
  },
  {
    title: "ICT & Computer Lab",
    description: "State-of-the-art computer facilities with high-speed internet, modern PCs, and educational software for digital literacy and skills.",
    image: '/lab.jpg', // ← REPLACE
  },
  {
    title: "Sickbay / Health Centre",
    description: "Fully equipped infirmary with qualified nurse on duty, providing immediate care and a comfortable space for students' well-being.",
    image: '/healthcenter.jpg', // ← REPLACE
  },
];

const classes = [
  {
    level: 'Nursery',
    range: 'Nursery 1 – 3',
    age: 'Ages 2 – 5 years',
    description: 'Play-based Montessori learning • Practical life skills • Sensory exploration • Building independence & joy in learning',
    gradient: 'from-amber-400/30 to-amber-600/10',
    textColor: 'text-amber-700',
    imagePlaceholder: '/nursery.png',
    bcolor: "#00BFFF",
    color: "white"
  },
  {
    level: 'Primary',
    range: 'Basic 1 – 5',
    age: 'Ages 5 – 11 years',
    description: 'Strong foundation in literacy & numeracy • Character education • Creative arts • Introduction to British & Nigerian curriculum',
    gradient: 'from-blue-400/30 to-blue-600/10',
    textColor: 'text-blue-700',
    imagePlaceholder: '/nursery2.png',
    color: 'black',
    bcolor: "white"
  },
  {
    level: 'Secondary',
    range: 'JSS 1–3 & SS 1–3',
    age: 'Ages 11 – 18 years',
    description: 'Comprehensive preparation for WAEC/NECO • Science, Commercial & Arts streams • Leadership development • University & career guidance',
    gradient: 'from-indigo-400/30 to-indigo-600/10',
    textColor: 'text-indigo-700',
    imagePlaceholder: '/ss.png',
    bcolor: "#9B59B6",
    color: 'white'
  },
];

const reasons = [
  {
    icon: Award,
    title: "Proven Excellence & Awards",
    desc: "BACMS is widely recognized as one of the best private schools in Benin City, Nigeria. We have consistently bagged numerous awards at both local and national levels — a testament to our unwavering commitment to quality education.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Users,
    title: "Exceptional Teachers",
    desc: "We recruit and retain only the best hands in the industry. Our committed staff display remarkable enthusiasm, dedication, and high-level teaching skills, ensuring every child receives personalized attention and inspiration.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Brain,
    title: "Future-Ready Skills",
    desc: "We stay ahead of current trends and equip our students with in-demand skills — from digital literacy and critical thinking to creativity and problem-solving — preparing them for success in a rapidly changing world.",
    color: "text-purple-600 bg-purple-50",
  },
  {
    icon: Heart,
    title: "Strong Parent-School Partnership",
    desc: "Positive relationships between parents, students, and teachers form the foundation of our learning environment. We encourage ongoing communication and collaboration to ensure your child's holistic success and happiness.",
    color: "text-red-600 bg-red-50",
  },
  {
    icon: ShieldCheck,
    title: "Conducive & Supportive Environment",
    desc: "We constantly strive to create a safe, nurturing, and stimulating environment where every student is supported to achieve the highest levels of success — academically, emotionally, and spiritually.",
    color: "text-emerald-600 bg-emerald-50",
  },
];

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  hover: { y: -8, boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)' },
};

export default function OurClasses() {
  return (
    <>
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Our Academic Journey
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            From joyful early exploration to confident senior secondary excellence —  
            we guide every child with faith, love, and Montessori-inspired education.
          </p>
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {classes.map((cls) => (
            <motion.div
              key={cls.level}
              variants={cardVariants}
              whileHover="hover"
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group rounded-3xl overflow-hidden shadow-xl border border-gray-100 transition-all duration-300 flex flex-col"
              style={{ backgroundColor: cls.bcolor, color: cls.color }}
            >
              {/* Image Area */}
              <div className="relative h-64 md:h-72 lg:h-80 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${cls.gradient}`} />
                <Image
                  src={cls.imagePlaceholder}
                  alt={`${cls.level} classroom at BACMS`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgG3Xj8TAAAAAElFTkSuQmCC"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-6xl md:text-7xl font-extrabold text-white/40 drop-shadow-lg">
                    {cls.level}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">
                    {cls.range}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed mb-5">
                    {cls.description}
                  </p>
                </div>
                <div className={`text-sm md:text-base font-medium ${cls.textColor} bg-gray-50/30 inline-block px-4 py-2 rounded-full`}>
                  {cls.age}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

       
      </div>
    </section>
  <section className="py-24 md:py-32 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">

      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Exceptional Learning Environments
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every space at Bishop Ajayi Crowther Montessori Schools is intentionally designed to nurture curiosity, creativity, health, and academic excellence.
          </p>
        </motion.div>

        {/* Facilities – Horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {facilities.map((facility) => (
              <motion.div
                key={facility.title}
                variants={itemVariants}
                className="group relative rounded-3xl overflow-hidden h-[420px] md:h-[480px] lg:h-[520px] shadow-2xl"
              >
                {/* Background Image */}
                <Image
                  src={facility.image}
                  alt={facility.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAErgG3Xj8TAAAAAElFTkSuQmCC"
                />

                {/* Glassmorphism Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                  <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 md:p-8 transition-all duration-500 group-hover:bg-white/15">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
                      {facility.title}
                    </h3>
                    <p className="text-gray-100 text-base md:text-lg leading-relaxed opacity-90">
                      {facility.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtle scroll hint on mobile */}
          <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-10 h-1.5 bg-white/40 rounded-full" />
            <div className="w-10 h-1.5 bg-white/70 rounded-full" />
            <div className="w-10 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-16 md:mt-24"
        >
          <a
            href="/gallery"
            className="inline-flex items-center gap-3 px-10 py-6 bg-white text-gray-900 rounded-2xl font-semibold text-lg shadow-2xl hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-2"
          >
            Explore All Facilities in Gallery →
          </a>
        </motion.div>
      </div>
    </section>
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Beyond the Classroom
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            At BACMS, we believe in developing the whole child. Our rich extra-curricular programs help students discover passions, build character, and develop lifelong skills.
          </p>
        </motion.div>

        {/* Activities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {activities.map((activity) => {
            const IconComponent = activity.icon; // ← rename for clarity

            return (
              <motion.div
                key={activity.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group bg-white rounded-2xl p-7 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={`p-5 rounded-2xl mb-5 transition-transform duration-300 group-hover:scale-110 ${activity.color}`}>
                  <IconComponent className="w-10 h-10" strokeWidth={1.8} />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {activity.title}
                </h3>
                
                <p className="text-gray-600 text-base leading-relaxed">
                  {activity.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.9 }}
          className="text-center mt-16 md:mt-20"
        >
          <a
            href="/admissions"
            className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
          >
            Join Our Vibrant Community Today →
          </a>
        </motion.div>
      </div>
    </section>
     <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Why Parents Trust BACMS
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            At Bishop Ajayi Crowther Montessori Schools, we don't just teach — we inspire, nurture, and empower every child to become confident, compassionate leaders of tomorrow.
          </p>
        </motion.div>

        {/* Visual Highlight - Montessori Classroom */}
        <div className="mb-16 md:mb-20 rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="/unnamed.webp"
            alt="Happy children in joyful Montessori classroom"
            className="w-full h-auto object-cover max-h-[500px]"
          />
        </div>

        {/* Reasons Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
            >
              <div className={`p-5 rounded-full mb-6 ${reason.color}`}>
                <reason.icon className="w-10 h-10" strokeWidth={1.8} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {reason.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Trust Builders */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-8">
          <div className="bg-indigo-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
              Awards & Recognition
            </h3>
            <p className="text-gray-700">
              Our students and school have received numerous accolades — proof of our consistent excellence in education across Benin City and beyond.
            </p>
            {/* Award images carousel */}
            <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
              <img src="https://honeylandschools.ng/wp-content/uploads/2025/10/Jury-Assessment-1_page-0019.jpg" alt="Students receiving awards" className="h-40 rounded-lg object-cover flex-shrink-0" />
               <img src="https://honeylandschools.ng/wp-content/uploads/2025/10/Jury-Assessment-1_page-0019.jpg" alt="Students receiving awards" className="h-40 rounded-lg object-cover flex-shrink-0" />
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-green-700 mb-4">
              Preparing for Tomorrow
            </h3>
            <p className="text-gray-700">
              We expose our students to cutting-edge skills like coding, robotics, and creative problem-solving — keeping them ahead in a digital world.
            </p>
            <div className="mt-6">
              <img src="/extra_activity.png" alt="Students learning robotics" className="rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
