import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Service from '../models/Service';
import JobModel from '../models/Job';
import Application from '../models/Application';

// Load environment variables
dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edujobs';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    let existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Updating existing admin user...');
      
      // Update the existing admin user with new credentials
      existingAdmin.username = process.env.ADMIN_USERNAME || 'ephrontuyishime21@gmail.com';
      existingAdmin.email = process.env.ADMIN_EMAIL || 'ephrontuyishime21@gmail.com';
      existingAdmin.password = process.env.ADMIN_PASSWORD || 'EduJobs21%';
      existingAdmin.isActive = true;
      
      await existingAdmin.save();
      console.log('Admin user updated successfully');
      console.log('Username:', existingAdmin.username);
      console.log('Email:', existingAdmin.email);
    } else {
      // Create new admin user if none exists
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME || 'ephrontuyishime21@gmail.com',
        email: process.env.ADMIN_EMAIL || 'ephrontuyishime21@gmail.com',
        password: process.env.ADMIN_PASSWORD || 'EduJobs21%',
        role: 'admin',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
      console.log('Username:', adminUser.username);
      console.log('Email:', adminUser.email);
    }
    
    console.log('  Admin credentials updated!');

    // Create sample testimonial if it doesn't exist
    const Testimonial = (await import('../models/Testimonial')).default;
    
    const existingTestimonial = await Testimonial.findOne({ name: 'John Doe' });
    if (!existingTestimonial) {
      const sampleTestimonial = new Testimonial({
        name: 'John Doe',
        role: 'Software Engineer',
        company: 'Tech Corp',
        content: 'EduJobs helped me find my dream job! The platform is user-friendly and the opportunities are excellent.',
        rating: 5,
        isApproved: true,
        featured: true
      });

      await sampleTestimonial.save();
      console.log('Sample testimonial created');
    } else {
      console.log('Sample testimonial already exists');
    }

    // Create sample services
    const adminUserId = existingAdmin?._id || (await User.findOne({ role: 'admin' }))?._id;
    
    const existingService = await Service.findOne({ title: 'University Application Assistance' });
    if (!existingService && adminUserId) {
      const sampleServices = [
        {
          title: 'University Application Assistance',
          description: 'Complete guidance for university applications including document preparation, application submission, and interview preparation.',
          category: 'university_application',
          price: 150,
          duration: '2-3 weeks',
          features: [
            'Document review and preparation',
            'Application form assistance',
            'Interview preparation',
            'University selection guidance',
            'Scholarship application support'
          ],
          isActive: true,
          isFeatured: true,
          createdBy: adminUserId
        },
        {
          title: 'Job Placement Services',
          description: 'Professional job placement assistance with resume optimization, interview coaching, and job matching.',
          category: 'job_placement',
          price: 100,
          duration: '1-2 weeks',
          features: [
            'Resume/CV optimization',
            'Job matching based on skills',
            'Interview coaching',
            'Salary negotiation tips',
            'Follow-up support'
          ],
          isActive: true,
          isFeatured: false,
          createdBy: adminUserId
        },
        {
          title: 'Career Consulting',
          description: 'One-on-one career consulting sessions to help you plan your professional journey.',
          category: 'consulting',
          price: 75,
          duration: '1 week',
          features: [
            'Career assessment',
            'Goal setting',
            'Action plan development',
            'Industry insights',
            'Networking guidance'
          ],
          isActive: true,
          isFeatured: false,
          createdBy: adminUserId
        }
      ];

      await Service.insertMany(sampleServices);
      console.log('Sample services created');
    } else {
      console.log('Sample services already exist');
    }

    // Create sample jobs
    const existingJob = await JobModel.findOne({ title: 'Software Developer' });
    if (!existingJob) {
      const sampleJobs = [
        {
          title: 'Software Developer',
          company: 'Tech Solutions Rwanda',
          location: 'Kigali, Rwanda',
          type: 'Full-time',
          category: 'Technology',
          tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
          description: 'We are looking for a skilled software developer to join our growing team. Experience with modern web technologies required.',
          applyUrl: 'https://techsolutions.rw/careers/software-developer',
          isFeatured: true
        },
        {
          title: 'Marketing Coordinator',
          company: 'EduCorp International',
          location: 'Kigali, Rwanda',
          type: 'Full-time',
          category: 'Marketing',
          tags: ['Digital Marketing', 'Social Media', 'Content Creation'],
          description: 'Join our marketing team to help promote educational services across East Africa.',
          applyUrl: 'https://educorp.com/jobs/marketing-coordinator',
          isFeatured: false
        },
        {
          title: 'Data Analyst Intern',
          company: 'Rwanda Development Board',
          location: 'Kigali, Rwanda',
          type: 'Internship',
          category: 'Data Science',
          tags: ['Python', 'SQL', 'Excel', 'Data Visualization'],
          description: 'Internship opportunity for recent graduates interested in data analysis and business intelligence.',
          applyUrl: 'https://rdb.rw/internships/data-analyst',
          isFeatured: false
        }
      ];

      await JobModel.insertMany(sampleJobs);
      console.log('Sample jobs created');
    } else {
      console.log('Sample jobs already exist');
    }

    // Create sample applications
    const existingApplication = await Application.findOne({ jobId: '5f5c1f4b5f5c1f4b' });
    if (!existingApplication) {
      const sampleApplications = [
        {
          jobId: '5f5c1f4b5f5c1f4b',
          userId: '5f5c1f4b5f5c1f4b',
          status: 'pending',
          resume: 'https://example.com/resume.pdf',
          coverLetter: 'https://example.com/cover-letter.pdf',
          isFeatured: false
        },
        {
          jobId: '5f5c1f4b5f5c1f4b',
          userId: '5f5c1f4b5f5c1f4b',
          status: 'rejected',
          resume: 'https://example.com/resume.pdf',
          coverLetter: 'https://example.com/cover-letter.pdf',
          isFeatured: false
        },
        {
          jobId: '5f5c1f4b5f5c1f4b',
          userId: '5f5c1f4b5f5c1f4b',
          status: 'accepted',
          resume: 'https://example.com/resume.pdf',
          coverLetter: 'https://example.com/cover-letter.pdf',
          isFeatured: false
        }
      ];

      await Application.insertMany(sampleApplications);
      console.log('Sample applications created');
    } else {
      console.log('Sample applications already exist');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function immediately
seedDatabase().catch(console.error);

export default seedDatabase;