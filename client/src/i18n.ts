import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', services: 'Services', apply: 'Apply', contact: 'Contact', login: 'Login', csm: 'CSM' },
      hero: {
        title: 'Welcome to EduJobs Scholars',
        subtitle: 'Your go-to platform for university application updates, job vacancies, and expert consulting services for students and job seekers.'
      },
      actions: {
        exploreApps: 'Explore University Applications',
        findJobs: 'Find Job Vacancies',
        consulting: 'Get Application Consulting',
      },
      contact: {
        title: 'Contact Us',
        subtitle: 'Reach out to us for support and partnerships.',
        name: 'Full Name',
        email: 'Email Address',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        sending: 'Sending...',
        success: 'Your message has been sent successfully. We will get back to you soon.',
        error: 'Failed to send your message. Please try again later.',
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
      },
    },
  },
  rw: {
    translation: {
      nav: { home: 'Ahabanza', services: 'Serivisi', apply: 'Saba none', contact: 'Tuvugishe', login: 'Injira', csm: 'CSM' },
      hero: {
        title: 'Murakaza neza kuri EduJobs Scholars',
        subtitle: 'Urubuga rwo kubona amakuru ajyanye n’amasomo, imyanya y’akazi, n’inama z’inzobere kubanyeshuri n’abashaka akazi.'
      },
      actions: { exploreApps: 'Reba Amasomo', findJobs: 'Shaka Akazi', consulting: 'Saba Inama' },
      contact: {
        title: 'Tuvugishe',
        subtitle: 'Twandikire kubufasha no gukorana natwe.',
        name: 'Amazina',
        email: 'Imeli',
        subject: 'Ingingo',
        message: 'Ubutumwa',
        send: 'Ohereza Ubutumwa',
        sending: 'Kohereza...',
        success: 'Ubutumwa bwawe bwoherejwe neza. Tuzagusubiza vuba.',
        error: 'Kohereza ubutumwa byanze. Ongera ugerageze nyuma.',
        required: 'Iki kibuga kirakenewe',
        invalidEmail: 'Shyiramo aderesi y’imeli ikwiye'
      }
    }
  },
  fr: {
    translation: {
      nav: { home: 'Accueil', services: 'Services', apply: 'Postuler', contact: 'Contact', login: 'Connexion', csm: 'CSM' },
      hero: {
        title: 'Bienvenue sur EduJobs Scholars',
        subtitle: 'Votre plateforme pour les mises à jour des candidatures universitaires, les offres d’emploi et les services de conseil.'
      },
      actions: { exploreApps: 'Explorer les candidatures', findJobs: 'Trouver des offres', consulting: 'Obtenir un conseil' },
      contact: {
        title: 'Nous contacter',
        subtitle: 'Contactez-nous pour du support et des partenariats.',
        name: 'Nom complet',
        email: 'Adresse e-mail',
        subject: 'Objet',
        message: 'Message',
        send: 'Envoyer',
        sending: 'Envoi...',
        success: 'Votre message a été envoyé avec succès. Nous vous répondrons bientôt.',
        error: 'Échec de l’envoi du message. Veuillez réessayer plus tard.',
        required: 'Ce champ est obligatoire',
        invalidEmail: 'Veuillez saisir une adresse e-mail valide'
      }
    }
  }
}

const savedLng = typeof window !== 'undefined' ? localStorage.getItem('lng') : null

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
