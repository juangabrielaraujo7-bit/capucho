export const business = {
  name: "Capucho Informática",
  phone: "(11) 94700-9632",
  phoneE164: "+5511947009632",
  instagram: "https://www.instagram.com/capucho_informatica/",
  street: "Rua Antônio de Couros, 461",
  district: "Vila Palmeiras",
  city: "São Paulo",
  state: "SP",
  postalCode: "02726-000",
};

export const fullAddress = `${business.street}, ${business.district}, ${business.city}, ${business.state}, ${business.postalCode}`;

export const wa = (
  message = "Olá, Capucho! Gostaria de solicitar atendimento para meu computador.",
) => `https://wa.me/5511947009632?text=${encodeURIComponent(message)}`;

export const maps =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(fullAddress);

export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${business.street}, ${business.district}, ${business.city}`,
)}&output=embed`;

export const asset = (name) => `/assets/${name}`;
