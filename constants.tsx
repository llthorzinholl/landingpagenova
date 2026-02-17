import { Service, Testimonial } from "./types";
import asbestosImage from "./assets/novasImgs/1.webp";
import internallImage from "./assets/novasImgs/2.webp";
import roofImage from "./assets/novasImgs/3.webp";
import safeImage from "./assets/novasImgs/4.webp";

export const SERVICES: Service[] = [
  {
    id: "asbestos",
    title: "External Asbestos Removal",
    description:
      "Safe, compliant removal of external asbestos from facades, garages, sheds and site structures across residential and commercial properties.",
    icon: "🚧",
    image: asbestosImage,
    revealDelay: 0,
  },
  {
    id: "meth",
    title: "Internal Asbestos Removal",
    description:
      "Controlled internal removal from walls, ceilings, bathrooms and plant rooms, with full containment, clearance and safe disposal.",
    icon: "🏠",
    image: internallImage,
    revealDelay: 200,
  },
  {
    id: "soil",
    title: "Roof and Eaves Removal",
    description:
      "Specialist removal of asbestos roofing and eaves, including safe strip-out, transport and compliant disposal to protect your site.",
    icon: "🏗️",
    image: roofImage,
    revealDelay: 400,
  },
  {
    id: "hazmat",
    title: "Make Safe",
    description:
      "Immediate risk controls for damaged or exposed asbestos, securing the area and stabilizing materials until full removal.",
    icon: "⚠️",
    image: safeImage,
    revealDelay: 600,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Robert Cheng",
    role: "Home Owner, Balmain",
    rating: 5,
    content:
      "AES were incredible. Their knowledge of asbestos management during our renovation gave us total confidence. The site was left immaculate.",
  },
  {
    id: "2",
    name: "Amanda Grey",
    role: "Project Manager",
    rating: 5,
    content:
      "Professional, punctual and highly skilled. They managed a complex remediation project for us and handled the testing with full transparency.",
  },
  {
    id: "3",
    name: "Johnathan V.",
    role: "Real Estate Agent",
    rating: 5,
    content:
      "We use AES for all our contaminated property cleanups. Their documentation is thorough and they understand the urgency of property sales.",
  },
];
