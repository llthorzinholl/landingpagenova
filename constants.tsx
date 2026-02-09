
import { Service, Testimonial } from './types';
import asbestosImage from './assets/novasImgs/1.png';

export const SERVICES: Service[] = [
  {
    id: 'asbestos',
    title: 'External Asbestos Removal',
    description: 'Safe, compliant removal of external asbestos from facades, garages, sheds and site structures across residential and commercial properties.',
    icon: '🚧',
    image: asbestosImage
  },
  {
    id: 'meth',
    title: 'Internal Asbestos Removal',
    description: 'Controlled internal removal from walls, ceilings, bathrooms and plant rooms, with full containment, clearance and safe disposal.',
    icon: '🏠',
    image: '/assets/novasImgs/2.png'
  },
  {
    id: 'soil',
    title: 'Roof and Eaves Removal',
    description: 'Specialist removal of asbestos roofing and eaves, including safe strip-out, transport and compliant disposal to protect your site.',
    icon: '🏗️',
    image: '/assets/novasImgs/3.png'
  },
  {
    id: 'hazmat',
    title: 'Make Safe',
    description: 'Immediate risk controls for damaged or exposed asbestos, securing the area and stabilizing materials until full removal.',
    icon: '⚠️',
    image: '/assets/novasImgs/4.png'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Robert Cheng',
    role: 'Home Owner, Balmain',
    rating: 5,
    content: 'AES were incredible. Their knowledge of asbestos management during our renovation gave us total confidence. The site was left immaculate.'
  },
  {
    id: '2',
    name: 'Amanda Grey',
    role: 'Project Manager',
    rating: 5,
    content: 'Professional, punctual and highly skilled. They managed a complex remediation project for us and handled the testing with full transparency.'
  },
  {
    id: '3',
    name: 'Johnathan V.',
    role: 'Real Estate Agent',
    rating: 5,
    content: 'We use AES for all our contaminated property cleanups. Their documentation is thorough and they understand the urgency of property sales.'
  }
];
