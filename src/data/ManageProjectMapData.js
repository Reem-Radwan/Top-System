// ManageProjectMapData.mockdata.js

export const MOCK_COMPANIES = {
  "1": {
    name: "Sodic Developments",
    projects: [
      { id: "101", name: "Eastown Residences" },
      { id: "102", name: "West Town Hub" },
      { id: "103", name: "Villette New Cairo" },
    ],
  },
  "2": {
    name: "Palm Hills Developments",
    projects: [
      { id: "201", name: "Palm Hills October" },
      { id: "202", name: "Palm Valley" },
      { id: "203", name: "Palm Parks" },
    ],
  },
  "3": {
    name: "Emaar Misr",
    projects: [
      { id: "301", name: "Marassi North Coast" },
      { id: "302", name: "Uptown Cairo" },
      { id: "303", name: "Cairo Gate" },
    ],
  },
  "4": {
    name: "Ora Developers",
    projects: [
      { id: "401", name: "Zed East New Cairo" },
      { id: "402", name: "Zed West 6th October" },
    ],
  },
};

export const CITY_OPTIONS = [
  "6th of October Gardens",
  "6th of October",
  "New 6th of October",
  "El Sheikh Zayed",
  "New Zayed",
  "New Sphinx",
];

export const MOCK_PROJECT_MAP_DATA = {
  "101": {
    city: "New 6th of October",
    description:
      "Eastown Residences is a vibrant mixed-use community in New Cairo offering contemporary apartments, penthouses, and townhouses surrounded by lush greenery and retail corridors.",
    center_lat: 30.0131,
    center_lng: 31.4915,
    video_url: null,
    boundary_coordinates: [
      [30.0155, 31.488],
      [30.0155, 31.495],
      [30.0108, 31.495],
      [30.0108, 31.488],
    ],
    images: [
      { id: 1001, sort: 1, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80" },
      { id: 1002, sort: 2, url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400&q=80" },
      { id: 1003, sort: 3, url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80" },
    ],
  },
  "102": {
    city: "6th of October",
    description:
      "West Town Hub is a premium commercial and residential hub in 6th of October City, featuring modern office spaces, retail outlets, and luxury apartments.",
    center_lat: 29.971,
    center_lng: 30.936,
    video_url: "https://example.com/videos/west_town.mp4",
    boundary_coordinates: [
      [29.974, 30.932],
      [29.974, 30.94],
      [29.968, 30.94],
      [29.968, 30.932],
    ],
    images: [
      { id: 1004, sort: 1, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" },
      { id: 1005, sort: 2, url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80" },
    ],
  },
  "103": {
    city: "New 6th of October",
    description:
      "Villette is a sprawling gated community in New Cairo offering villas, twin houses, and apartments set amidst vast green landscapes and a world-class golf course.",
    center_lat: 30.027,
    center_lng: 31.504,
    video_url: null,
    boundary_coordinates: [],
    images: [
      { id: 1006, sort: 1, url: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&q=80" },
    ],
  },
  "201": {
    city: "6th of October",
    description:
      "Palm Hills October is one of Egypt's most prestigious gated communities, offering a full lifestyle with schools, a country club, commercial areas, and diverse residential units.",
    center_lat: 29.9605,
    center_lng: 30.919,
    video_url: null,
    boundary_coordinates: [
      [29.964, 30.914],
      [29.964, 30.924],
      [29.957, 30.924],
      [29.957, 30.914],
    ],
    images: [
      { id: 2001, sort: 1, url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80" },
      { id: 2002, sort: 2, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80" },
      { id: 2003, sort: 3, url: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80" },
      { id: 2004, sort: 4, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" },
    ],
  },
  "202": {
    city: "6th of October",
    description:
      "Palm Valley offers families a serene, green lifestyle with townhouses and apartments integrated within one of October's most established residential developments.",
    center_lat: 29.953,
    center_lng: 30.925,
    video_url: null,
    boundary_coordinates: [],
    images: [],
  },
  "203": {
    city: "New Zayed",
    description:
      "Palm Parks is a modern residential community in New Zayed offering elegantly designed apartments and duplex units surrounded by lush parks and recreational facilities.",
    center_lat: 30.001,
    center_lng: 30.878,
    video_url: null,
    boundary_coordinates: [
      [30.004, 30.874],
      [30.004, 30.882],
      [29.998, 30.882],
      [29.998, 30.874],
    ],
    images: [
      { id: 2005, sort: 1, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
    ],
  },
  "301": {
    city: "6th of October Gardens",
    description:
      "Marassi is a luxurious Mediterranean-inspired resort community on Egypt's North Coast, offering villas, chalets, and hotel-branded residences along pristine beaches.",
    center_lat: 30.856,
    center_lng: 28.983,
    video_url: "https://example.com/videos/marassi.mp4",
    boundary_coordinates: [
      [30.86, 28.977],
      [30.86, 28.989],
      [30.852, 28.989],
      [30.852, 28.977],
    ],
    images: [
      { id: 3001, sort: 1, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
      { id: 3002, sort: 2, url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80" },
    ],
  },
  "302": {
    city: "New 6th of October",
    description:
      "Uptown Cairo is a hillside mixed-use mega-development offering spectacular views over Cairo, with retail, dining, hotels, and residential towers in an elevated urban setting.",
    center_lat: 29.982,
    center_lng: 31.356,
    video_url: null,
    boundary_coordinates: [],
    images: [
      { id: 3003, sort: 1, url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
    ],
  },
  "303": {
    city: "El Sheikh Zayed",
    description:
      "Cairo Gate is a contemporary transit-oriented development in El Sheikh Zayed, featuring premium residences, offices, and a retail boulevard directly accessible from the ring road.",
    center_lat: 30.023,
    center_lng: 30.965,
    video_url: null,
    boundary_coordinates: [
      [30.026, 30.961],
      [30.026, 30.969],
      [30.02, 30.969],
      [30.02, 30.961],
    ],
    images: [],
  },
  "401": {
    city: "New 6th of October",
    description:
      "Zed East is a contemporary residential development in New Cairo by Ora Developers, blending smart design with lush surroundings across a range of apartment and townhouse options.",
    center_lat: 30.0195,
    center_lng: 31.521,
    video_url: null,
    boundary_coordinates: [
      [30.0225, 31.517],
      [30.0225, 31.525],
      [30.0165, 31.525],
      [30.0165, 31.517],
    ],
    images: [
      { id: 4001, sort: 1, url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" },
      { id: 4002, sort: 2, url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=400&q=80" },
    ],
  },
  "402": {
    city: "New Zayed",
    description:
      "Zed West brings Ora's signature design philosophy to West Cairo, offering spacious villas and apartments within a thoughtfully planned green community in New Zayed.",
    center_lat: 30.005,
    center_lng: 30.861,
    video_url: null,
    boundary_coordinates: [],
    images: [
      { id: 4003, sort: 1, url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&q=80" },
    ],
  },
};