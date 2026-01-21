

// // // Mock data generator for inventory dashboard

// // const generateMockUnits = () => {
// //   const companies = [
// //     { id: 1, name: "Mint" },
// //     { id: 2, name: "Palmier Developments" },
// //     { id: 3, name: "IGI Developments" }
// //   ];

// //   const projects = ["Ocean View", "City Center", "Green Hills", "Riverside Tower", "Palm Residences"];
// //   const cities = ["Cairo", "Alexandria", "Giza", "Hurghada"];
// //   const unitTypes = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"];
// //   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
// //   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
// //   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
// //   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
// //   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

// //   // ✅ Make "Blocked Development" NOT exist everywhere
// //   // Adjust these sets to match your real-life expectation.
// //  const blockedAllowedProjects = new Set(["Ocean View", "City Center"]);
// // blockedAllowedProjects.add("Palm Residences", "Green Hills");
// //   const blockedAllowedCities = new Set(["Cairo", "Giza"]); // only these cities can have blocked
// //   const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse"]); // optional restriction
// //   const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]); // optional restriction

// //   const units = [];
// //   const numberOfUnits = 500;

// //   for (let i = 0; i < numberOfUnits; i++) {
// //     const project = projects[Math.floor(Math.random() * projects.length)];
// //     const city = cities[Math.floor(Math.random() * cities.length)];
// //     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
// //     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
// //     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
// //     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
// //     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

// //     // ✅ Pick status, but enforce restrictions for "Blocked Development"
// //     let status = statuses[Math.floor(Math.random() * statuses.length)];

// //     if (status === "Blocked Development") {
// //       const allowed =
// //         blockedAllowedProjects.has(project) &&
// //         blockedAllowedCities.has(city) &&
// //         blockedAllowedUnitTypes.has(unitType) &&
// //         blockedAllowedAreas.has(areaRange);

// //       if (!allowed) {
// //         // re-roll to a non-blocked status
// //         const nonBlocked = statuses.filter((s) => s !== "Blocked Development");
// //         status = nonBlocked[Math.floor(Math.random() * nonBlocked.length)];
// //       }
// //     }

// //     // Generate sellable area based on unit type
// //     let minArea, maxArea;
// //     switch (unitType) {
// //       case "Studio":
// //         minArea = 50;
// //         maxArea = 75;
// //         break;
// //       case "1 Bedroom":
// //         minArea = 75;
// //         maxArea = 100;
// //         break;
// //       case "2 Bedroom":
// //         minArea = 100;
// //         maxArea = 125;
// //         break;
// //       case "3 Bedroom":
// //         minArea = 125;
// //         maxArea = 150;
// //         break;
// //       case "Penthouse":
// //         minArea = 150;
// //         maxArea = 250;
// //         break;
// //       default:
// //         minArea = 50;
// //         maxArea = 100;
// //     }

// //     const sellableArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
// //     const psmBase = 15000 + Math.random() * 10000; // PSM between 15k and 25k
// //     const psm = Math.floor(psmBase);
// //     const interestFreePrice = Math.floor(sellableArea * psmBase);
// //     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

// //     // Generate dates
// //     const hasReservation = ["Contracted", "Reserved", "Hold", "Partner"].includes(status);
// //     const reservationDate = hasReservation
// //       ? new Date(
// //           2020 + Math.floor(Math.random() * 5),
// //           Math.floor(Math.random() * 12),
// //           Math.floor(Math.random() * 28) + 1
// //         )
// //       : null;

// //     const contractDeliveryDate = new Date(
// //       2024 + Math.floor(Math.random() * 3),
// //       Math.floor(Math.random() * 12),
// //       Math.floor(Math.random() * 28) + 1
// //     );

// //     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months

// //     const developmentDeliveryDate = new Date(contractDeliveryDate);
// //     developmentDeliveryDate.setMonth(
// //       developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)
// //     ); // +/- 3 months variation

// //     units.push({
// //       id: i + 1,
// //       city,
// //       project,
// //       project_name: project,
// //       unit_type: unitType,
// //       area_range: areaRange,
// //       adj_status_2: status,
// //       status,
// //       sellable_area: sellableArea,
// //       psm,
// //       interest_free_unit_price: interestFreePrice,
// //       sales_value: salesValue,
// //       building_type: buildingType,
// //       grace_period_months: gracePeriodMonths,
// //       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
// //       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
// //       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
// //       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
// //       unit_model: unitModel,
// //       adj_contract_payment_plan: paymentPlan
// //     });
// //   }

// //   return { companies, units };
// // };

// // const mockData = generateMockUnits();

// // export const getCompanies = () => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve(mockData.companies);
// //     }, 100);
// //   });
// // };

// // export const getCompanyUnits = (companyId) => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve({
// //         units: mockData.units,
// //         company: mockData.companies.find((c) => c.id === parseInt(companyId))
// //       });
// //     }, 300);
// //   });
// // };

// // export default mockData;






// // // Mock data generator for inventory dashboard

// // const generateCompanySpecificUnits = (companyId, companyName) => {
// //   // Company-specific configurations
// //   const companyConfigs = {
// //     1: { // Skyline Developments
// //       projects: ["Skyline Towers", "Azure Heights", "Crystal Plaza", "Diamond Residence", "Emerald Gardens"],
// //       cities: ["Cairo", "New Cairo", "6th October"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
// //       numberOfUnits: 600,
// //       priceMultiplier: 1.2,
// //       areaMultiplier: 1.1
// //     },
// //     2: { // Urban Properties Ltd
// //       projects: ["Urban Oasis", "Metropolitan Plaza", "City Hub", "Downtown Suites", "Urban Vista"],
// //       cities: ["Alexandria", "New Alexandria", "Borg El Arab"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Loft"],
// //       numberOfUnits: 450,
// //       priceMultiplier: 1.0,
// //       areaMultiplier: 1.0
// //     },
// //     3: { // Metro Construction
// //       projects: ["Metro Park", "Central Station", "Transit Hub", "Metro Heights", "Railway Gardens"],
// //       cities: ["Giza", "Sheikh Zayed", "New Giza"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
// //       numberOfUnits: 550,
// //       priceMultiplier: 0.9,
// //       areaMultiplier: 0.95
// //     }
// //   };

// //   const config = companyConfigs[companyId] || companyConfigs[1];
  
// //   const projects = config.projects;
// //   const cities = config.cities;
// //   const unitTypes = config.unitTypes;
// //   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
// //   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
// //   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
// //   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
// //   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

// //   const units = [];
// //   const numberOfUnits = config.numberOfUnits;

// //   for (let i = 0; i < numberOfUnits; i++) {
// //     const project = projects[Math.floor(Math.random() * projects.length)];
// //     const city = cities[Math.floor(Math.random() * cities.length)];
// //     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
// //     const status = statuses[Math.floor(Math.random() * statuses.length)];
// //     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
// //     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
// //     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
// //     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

// //     // Generate sellable area based on unit type
// //     let minArea, maxArea;
// //     switch (unitType) {
// //       case "Studio":
// //         minArea = 50;
// //         maxArea = 75;
// //         break;
// //       case "1 Bedroom":
// //         minArea = 75;
// //         maxArea = 100;
// //         break;
// //       case "2 Bedroom":
// //         minArea = 100;
// //         maxArea = 125;
// //         break;
// //       case "3 Bedroom":
// //         minArea = 125;
// //         maxArea = 150;
// //         break;
// //       case "Penthouse":
// //         minArea = 150;
// //         maxArea = 250;
// //         break;
// //       default:
// //         minArea = 50;
// //         maxArea = 100;
// //     }

// //     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
// //     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
// //     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier; // PSM between 15k and 25k, adjusted by company
// //     const psm = Math.floor(psmBase);
// //     const interestFreePrice = Math.floor(sellableArea * psmBase);
// //     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

// //     // Generate dates
// //     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
// //     const reservationDate = hasReservation
// //       ? new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
// //       : null;

// //     const contractDeliveryDate = new Date(2024 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
// //     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months
// //     const developmentDeliveryDate = new Date(contractDeliveryDate);
// //     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)); // +/- 3 months variation

// //     units.push({
// //       id: i + 1,
// //       city,
// //       project,
// //       project_name: project, // Add this for the modal
// //       unit_type: unitType,
// //       area_range: areaRange,
// //       adj_status_2: status,
// //       status,
// //       sellable_area: sellableArea,
// //       psm,
// //       interest_free_unit_price: interestFreePrice,
// //       sales_value: salesValue,
// //       building_type: buildingType,
// //       grace_period_months: gracePeriodMonths,
// //       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
// //       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
// //       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
// //       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
// //       unit_model: unitModel,
// //       adj_contract_payment_plan: paymentPlan
// //     });
// //   }

// //   return units;
// // };

// // // Generate data for all companies
// // const companies = [
// //   { id: 1, name: "Skyline Developments" },
// //   { id: 2, name: "Urban Properties Ltd" },
// //   { id: 3, name: "Metro Construction" }
// // ];

// // // Pre-generate data for each company
// // const companyDataCache = {};
// // companies.forEach(company => {
// //   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// // });

// // export const getCompanies = () => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve(companies);
// //     }, 100);
// //   });
// // };

// // export const getCompanyUnits = (companyId) => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       const id = parseInt(companyId);
// //       const units = companyDataCache[id] || companyDataCache[1];
// //       const company = companies.find(c => c.id === id);
      
// //       console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
// //       console.log(`Total units: ${units.length}`);
      
// //       resolve({
// //         units: units,
// //         company: company
// //       });
// //     }, 300);
// //   });
// // };

// // export default { companies, getCompanyUnits };



// // Mock data generator for inventory dashboard

// // const generateMockUnits = () => {
// //   const companies = [
// //     { id: 1, name: "Mint" },
// //     { id: 2, name: "Palmier Developments" },
// //     { id: 3, name: "IGI Developments" }
// //   ];

// //   const projects = ["Ocean View", "City Center", "Green Hills", "Riverside Tower", "Palm Residences"];
// //   const cities = ["Cairo", "Alexandria", "Giza", "Hurghada"];
// //   const unitTypes = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"];
// //   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
// //   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
// //   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
// //   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
// //   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

// //   // ✅ Make "Blocked Development" NOT exist everywhere
// //   const blockedAllowedProjects = new Set(["Ocean View", "City Center", "Palm Residences", "Green Hills"]);
// //   const blockedAllowedCities = new Set(["Cairo", "Giza"]);
// //   const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse"]);
// //   const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]);

// //   const units = [];
// //   const numberOfUnits = 500;

// //   for (let i = 0; i < numberOfUnits; i++) {
// //     const project = projects[Math.floor(Math.random() * projects.length)];
// //     const city = cities[Math.floor(Math.random() * cities.length)];
// //     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
// //     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
// //     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
// //     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
// //     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

// //     // ✅ Pick status, but enforce restrictions for "Blocked Development"
// //     let status = statuses[Math.floor(Math.random() * statuses.length)];

// //     if (status === "Blocked Development") {
// //       const allowed =
// //         blockedAllowedProjects.has(project) &&
// //         blockedAllowedCities.has(city) &&
// //         blockedAllowedUnitTypes.has(unitType) &&
// //         blockedAllowedAreas.has(areaRange);

// //       if (!allowed) {
// //         // re-roll to a non-blocked status
// //         const nonBlocked = statuses.filter((s) => s !== "Blocked Development");
// //         status = nonBlocked[Math.floor(Math.random() * nonBlocked.length)];
// //       }
// //     }

// //     // Generate sellable area based on unit type
// //     let minArea, maxArea;
// //     switch (unitType) {
// //       case "Studio":
// //         minArea = 50;
// //         maxArea = 75;
// //         break;
// //       case "1 Bedroom":
// //         minArea = 75;
// //         maxArea = 100;
// //         break;
// //       case "2 Bedroom":
// //         minArea = 100;
// //         maxArea = 125;
// //         break;
// //       case "3 Bedroom":
// //         minArea = 125;
// //         maxArea = 150;
// //         break;
// //       case "Penthouse":
// //         minArea = 150;
// //         maxArea = 250;
// //         break;
// //       default:
// //         minArea = 50;
// //         maxArea = 100;
// //     }

// //     const sellableArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
// //     const psmBase = 15000 + Math.random() * 10000; // PSM between 15k and 25k
// //     const psm = Math.floor(psmBase);
// //     const interestFreePrice = Math.floor(sellableArea * psmBase);
// //     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

// //     // Generate dates
// //     const hasReservation = ["Contracted", "Reserved", "Hold", "Partner"].includes(status);
// //     const reservationDate = hasReservation
// //       ? new Date(
// //           2020 + Math.floor(Math.random() * 5),
// //           Math.floor(Math.random() * 12),
// //           Math.floor(Math.random() * 28) + 1
// //         )
// //       : null;

// //     const contractDeliveryDate = new Date(
// //       2024 + Math.floor(Math.random() * 3),
// //       Math.floor(Math.random() * 12),
// //       Math.floor(Math.random() * 28) + 1
// //     );

// //     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months

// //     const developmentDeliveryDate = new Date(contractDeliveryDate);
// //     developmentDeliveryDate.setMonth(
// //       developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)
// //     ); // +/- 3 months variation

// //     units.push({
// //       id: i + 1,
// //       city,
// //       project,
// //       project_name: project,
// //       unit_type: unitType,
// //       area_range: areaRange,
// //       adj_status_2: status,
// //       status,
// //       sellable_area: sellableArea,
// //       psm,
// //       interest_free_unit_price: interestFreePrice,
// //       sales_value: salesValue,
// //       building_type: buildingType,
// //       grace_period_months: gracePeriodMonths,
// //       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
// //       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
// //       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
// //       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
// //       unit_model: unitModel,
// //       adj_contract_payment_plan: paymentPlan
// //     });
// //   }

// //   return { companies, units };
// // };

// // // Company-specific data generator
// // const generateCompanySpecificUnits = (companyId, companyName) => {
// //   // Company-specific configurations
// //   const companyConfigs = {
// //     1: { // Mint
// //       projects: ["Mint Tower", "Mint Gardens", "Mint Residences", "Mint Plaza", "Mint Oasis"],
// //       cities: ["Cairo", "New Cairo", "6th October", "Maadi"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
// //       numberOfUnits: 600,
// //       priceMultiplier: 1.3, // Higher end
// //       areaMultiplier: 1.15
// //     },
// //     2: { // Palmier Developments
// //       projects: ["Palmier Views", "Palmier Heights", "Palmier Bay", "Palmier City", "Palmier Greens"],
// //       cities: ["Alexandria", "North Coast", "New Alexandria", "Borg El Arab"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Villa"],
// //       numberOfUnits: 450,
// //       priceMultiplier: 1.1, // Premium
// //       areaMultiplier: 1.05
// //     },
// //     3: { // IGI Developments
// //       projects: ["IGI Tower", "IGI Plaza", "IGI Residence", "IGI Hub", "IGI Gardens"],
// //       cities: ["Giza", "Sheikh Zayed", "New Giza", "Haram"],
// //       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
// //       numberOfUnits: 550,
// //       priceMultiplier: 1.0, // Standard
// //       areaMultiplier: 1.0
// //     }
// //   };

// //   const config = companyConfigs[companyId] || companyConfigs[1];
  
// //   const projects = config.projects;
// //   const cities = config.cities;
// //   const unitTypes = config.unitTypes;
// //   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
// //   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
// //   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
// //   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
// //   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

// //   const units = [];
// //   const numberOfUnits = config.numberOfUnits;

// //   for (let i = 0; i < numberOfUnits; i++) {
// //     const project = projects[Math.floor(Math.random() * projects.length)];
// //     const city = cities[Math.floor(Math.random() * cities.length)];
// //     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
// //     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
// //     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
// //     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
// //     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

// //     // ✅ Pick status, but enforce restrictions for "Blocked Development" (similar logic as before)
// //     let status = statuses[Math.floor(Math.random() * statuses.length)];

// //     if (status === "Blocked Development") {
// //       // Company-specific blocked development rules
// //       const blockedAllowedProjects = new Set([projects[0], projects[1]]); // First two projects can have blocked
// //       const blockedAllowedCities = new Set([cities[0], cities[1]]); // First two cities
// //       const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse"]);
// //       const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]);

// //       const allowed =
// //         blockedAllowedProjects.has(project) &&
// //         blockedAllowedCities.has(city) &&
// //         blockedAllowedUnitTypes.has(unitType) &&
// //         blockedAllowedAreas.has(areaRange);

// //       if (!allowed) {
// //         // re-roll to a non-blocked status
// //         const nonBlocked = statuses.filter((s) => s !== "Blocked Development");
// //         status = nonBlocked[Math.floor(Math.random() * nonBlocked.length)];
// //       }
// //     }

// //     // Generate sellable area based on unit type
// //     let minArea, maxArea;
// //     switch (unitType) {
// //       case "Studio":
// //         minArea = 50;
// //         maxArea = 75;
// //         break;
// //       case "1 Bedroom":
// //         minArea = 75;
// //         maxArea = 100;
// //         break;
// //       case "2 Bedroom":
// //         minArea = 100;
// //         maxArea = 125;
// //         break;
// //       case "3 Bedroom":
// //         minArea = 125;
// //         maxArea = 150;
// //         break;
// //       case "Penthouse":
// //         minArea = 150;
// //         maxArea = 250;
// //         break;
// //       default:
// //         minArea = 50;
// //         maxArea = 100;
// //     }

// //     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
// //     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
// //     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier;
// //     const psm = Math.floor(psmBase);
// //     const interestFreePrice = Math.floor(sellableArea * psmBase);
// //     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2));

// //     // Generate dates
// //     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
// //     const reservationDate = hasReservation
// //       ? new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
// //       : null;

// //     const contractDeliveryDate = new Date(2024 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
// //     const gracePeriodMonths = Math.floor(Math.random() * 7);
// //     const developmentDeliveryDate = new Date(contractDeliveryDate);
// //     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3));

// //     units.push({
// //       id: i + 1,
// //       city,
// //       project,
// //       project_name: project,
// //       unit_type: unitType,
// //       area_range: areaRange,
// //       adj_status_2: status,
// //       status,
// //       sellable_area: sellableArea,
// //       psm,
// //       interest_free_unit_price: interestFreePrice,
// //       sales_value: salesValue,
// //       building_type: buildingType,
// //       grace_period_months: gracePeriodMonths,
// //       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
// //       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
// //       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
// //       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
// //       unit_model: unitModel,
// //       adj_contract_payment_plan: paymentPlan,
// //       // Add company-specific metadata
// //       company_id: companyId,
// //       company_name: companyName
// //     });
// //   }

// //   return units;
// // };

// // // Keep the companies from the first code
// // const companies = [
// //   { id: 1, name: "Mint" },
// //   { id: 2, name: "Palmier Developments" },
// //   { id: 3, name: "IGI Developments" }
// // ];

// // // Pre-generate company-specific data for each company
// // const companyDataCache = {};
// // companies.forEach(company => {
// //   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// // });

// // // For backward compatibility, also generate the generic data
// // const genericData = generateMockUnits();

// // export const getCompanies = () => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       resolve(companies);
// //     }, 100);
// //   });
// // };

// // export const getCompanyUnits = (companyId) => {
// //   return new Promise((resolve) => {
// //     setTimeout(() => {
// //       const id = parseInt(companyId);
      
// //       // Use company-specific data if available, otherwise use generic data
// //       let units;
// //       let company;
      
// //       if (companyDataCache[id]) {
// //         units = companyDataCache[id];
// //         company = companies.find(c => c.id === id);
// //         console.log(`Loading company-specific data for: ${company?.name} (ID: ${id})`);
// //       } else {
// //         // Fallback to generic data
// //         units = genericData.units;
// //         company = companies.find(c => c.id === id) || companies[0];
// //         console.log(`Loading generic data for company: ${company?.name} (ID: ${id})`);
// //       }
      
// //       console.log(`Total units loaded: ${units.length}`);
      
// //       resolve({
// //         units: units,
// //         company: company
// //       });
// //     }, 300);
// //   });
// // };

// // // For backward compatibility
// // const mockData = {
// //   companies: companies,
// //   units: genericData.units
// // };

// // export default mockData;



// const generateCompanySpecificUnits = (companyId, companyName) => {
//   // Company-specific configurations - UPDATED to match first code company names
//   const companyConfigs = {
//     1: { // Mint
//       projects: ["Mint Tower", "Mint Gardens", "Mint Residences", "Mint Plaza", "Mint Oasis"],
//       cities: ["Cairo", "New Cairo", "6th October", "Maadi"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
//       numberOfUnits: 600,
//       priceMultiplier: 1.3, // Higher end
//       areaMultiplier: 1.15
//     },
//     2: { // Palmier Developments
//       projects: ["Palmier Views", "Palmier Heights", "Palmier Bay", "Palmier City", "Palmier Greens"],
//       cities: ["Alexandria", "North Coast", "New Alexandria", "Borg El Arab"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Villa"],
//       numberOfUnits: 450,
//       priceMultiplier: 1.1, // Premium
//       areaMultiplier: 1.05
//     },
//     3: { // IGI Developments
//       projects: ["IGI Tower", "IGI Plaza", "IGI Residence", "IGI Hub", "IGI Gardens"],
//       cities: ["Giza", "Sheikh Zayed", "New Giza", "Haram"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
//       numberOfUnits: 550,
//       priceMultiplier: 1.0, // Standard
//       areaMultiplier: 1.0
//     }
//   };

//   const config = companyConfigs[companyId] || companyConfigs[1];
  
//   const projects = config.projects;
//   const cities = config.cities;
//   const unitTypes = config.unitTypes;
//   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
//   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
//   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
//   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
//   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

//   const units = [];
//   const numberOfUnits = config.numberOfUnits;

//   for (let i = 0; i < numberOfUnits; i++) {
//     const project = projects[Math.floor(Math.random() * projects.length)];
//     const city = cities[Math.floor(Math.random() * cities.length)];
//     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
    
//     // Weighted status distribution - more contracted units for realistic sales progress
//     const statusRandom = Math.random();
//     let status;
//     if (statusRandom < 0.35) {
//       status = "Contracted"; // 35% contracted
//     } else if (statusRandom < 0.50) {
//       status = "Available"; // 15% available
//     } else if (statusRandom < 0.60) {
//       status = "Reserved"; // 10% reserved
//     } else if (statusRandom < 0.70) {
//       status = "Unreleased"; // 10% unreleased
//     } else if (statusRandom < 0.80) {
//       status = "Blocked Development"; // 10% blocked
//     } else if (statusRandom < 0.90) {
//       status = "Partner"; // 10% partner
//     } else {
//       status = "Hold"; // 10% hold
//     }
    
//     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
//     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
//     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
//     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

//     // Generate sellable area based on unit type
//     let minArea, maxArea;
//     switch (unitType) {
//       case "Studio":
//         minArea = 50;
//         maxArea = 75;
//         break;
//       case "1 Bedroom":
//         minArea = 75;
//         maxArea = 100;
//         break;
//       case "2 Bedroom":
//         minArea = 100;
//         maxArea = 125;
//         break;
//       case "3 Bedroom":
//         minArea = 125;
//         maxArea = 150;
//         break;
//       case "Penthouse":
//         minArea = 150;
//         maxArea = 250;
//         break;
//       default:
//         minArea = 50;
//         maxArea = 100;
//     }

//     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
//     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
//     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier; // PSM between 15k and 25k, adjusted by company
//     const psm = Math.floor(psmBase);
//     const interestFreePrice = Math.floor(sellableArea * psmBase);
//     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

//     // Generate dates - realistic distribution up to current date (Jan 2026)
//     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
//     let reservationDate = null;
    
//     if (hasReservation) {
//       // Only generate dates from 2020 to Jan 2026 (current time)
//       const currentDate = new Date(2026, 0, 19); // Jan 19, 2026
//       const startDate = new Date(2020, 0, 1); // Jan 1, 2020
      
//       // Calculate random date between start and current
//       const timeRange = currentDate.getTime() - startDate.getTime();
//       const randomTime = Math.random() * timeRange;
//       reservationDate = new Date(startDate.getTime() + randomTime);
      
//       // Increase probability of recent dates (more sales in recent years)
//       // 60% chance of being in last 2 years
//       if (Math.random() < 0.6) {
//         const recentStart = new Date(2024, 0, 1); // Jan 1, 2024
//         const recentRange = currentDate.getTime() - recentStart.getTime();
//         const recentRandom = Math.random() * recentRange;
//         reservationDate = new Date(recentStart.getTime() + recentRandom);
//       }
//     }

//     const contractDeliveryDate = new Date(2024 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
//     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months
//     const developmentDeliveryDate = new Date(contractDeliveryDate);
//     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)); // +/- 3 months variation

//     units.push({
//       id: i + 1,
//       city,
//       project,
//       project_name: project, // Add this for the modal
//       unit_type: unitType,
//       area_range: areaRange,
//       adj_status_2: status,
//       status,
//       sellable_area: sellableArea,
//       psm,
//       interest_free_unit_price: interestFreePrice,
//       sales_value: salesValue,
//       building_type: buildingType,
//       grace_period_months: gracePeriodMonths,
//       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
//       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
//       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
//       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
//       unit_model: unitModel,
//       adj_contract_payment_plan: paymentPlan,
//       // Add company-specific metadata to match first code structure
//       company_id: companyId,
//       company_name: companyName
//     });
//   }

//   return units;
// };

// // Generate data for all companies - UPDATED to match first code company names
// const companies = [
//   { id: 1, name: "Mint" },
//   { id: 2, name: "Palmier Developments" },
//   { id: 3, name: "IGI Developments" }
// ];

// // Pre-generate data for each company
// const companyDataCache = {};
// companies.forEach(company => {
//   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// });

// export const getCompanies = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(companies);
//     }, 100);
//   });
// };

// export const getCompanyUnits = (companyId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const id = parseInt(companyId);
//       const units = companyDataCache[id] || companyDataCache[1];
//       const company = companies.find(c => c.id === id);
      
//       console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
//       console.log(`Total units: ${units.length}`);
      
//       resolve({
//         units: units,
//         company: company
//       });
//     }, 300);
//   });
// };

// export default { companies, getCompanyUnits };








// // Mock data generator for inventory dashboard

// const generateCompanySpecificUnits = (companyId, companyName) => {
//   // Company-specific configurations
//   const companyConfigs = {
//     1: { // Skyline Developments
//       projects: ["Skyline Towers", "Azure Heights", "Crystal Plaza", "Diamond Residence", "Emerald Gardens"],
//       cities: ["Cairo", "New Cairo", "6th October"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
//       numberOfUnits: 600,
//       priceMultiplier: 1.2,
//       areaMultiplier: 1.1
//     },
//     2: { // Urban Properties Ltd
//       projects: ["Urban Oasis", "Metropolitan Plaza", "City Hub", "Downtown Suites", "Urban Vista"],
//       cities: ["Alexandria", "New Alexandria", "Borg El Arab"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Loft"],
//       numberOfUnits: 450,
//       priceMultiplier: 1.0,
//       areaMultiplier: 1.0
//     },
//     3: { // Metro Construction
//       projects: ["Metro Park", "Central Station", "Transit Hub", "Metro Heights", "Railway Gardens"],
//       cities: ["Giza", "Sheikh Zayed", "New Giza"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
//       numberOfUnits: 550,
//       priceMultiplier: 0.9,
//       areaMultiplier: 0.95
//     }
//   };

//   const config = companyConfigs[companyId] || companyConfigs[1];
  
//   const projects = config.projects;
//   const cities = config.cities;
//   const unitTypes = config.unitTypes;
//   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
//   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
//   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
//   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
//   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

//   // ✅ Make "Blocked Development" NOT exist everywhere - Company-specific restrictions
//   const blockedAllowedProjects = new Set([projects[0], projects[1]]); // First two projects can have blocked
//   const blockedAllowedCities = new Set([cities[0], cities[1]]); // First two cities
//   const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse", "Duplex", "Loft"]);
//   const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]);

//   const units = [];
//   const numberOfUnits = config.numberOfUnits;

//   for (let i = 0; i < numberOfUnits; i++) {
//     const project = projects[Math.floor(Math.random() * projects.length)];
//     const city = cities[Math.floor(Math.random() * cities.length)];
//     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
//     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
//     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
//     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
//     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

//     // ✅ Weighted status distribution - MUCH more contracted units for less dashes
//     const statusRandom = Math.random();
//     let status;
//     if (statusRandom < 0.60) {
//       status = "Contracted"; // 60% contracted (was 35%)
//     } else if (statusRandom < 0.70) {
//       status = "Available"; // 10% available
//     } else if (statusRandom < 0.78) {
//       status = "Reserved"; // 8% reserved
//     } else if (statusRandom < 0.85) {
//       status = "Unreleased"; // 7% unreleased
//     } else if (statusRandom < 0.90) {
//       status = "Blocked Development"; // 5% blocked
//     } else if (statusRandom < 0.95) {
//       status = "Partner"; // 5% partner
//     } else {
//       status = "Hold"; // 5% hold
//     }

//     // ✅ Enforce restrictions for "Blocked Development"
//     if (status === "Blocked Development") {
//       const allowed =
//         blockedAllowedProjects.has(project) &&
//         blockedAllowedCities.has(city) &&
//         blockedAllowedUnitTypes.has(unitType) &&
//         blockedAllowedAreas.has(areaRange);

//       if (!allowed) {
//         // re-roll to a non-blocked status
//         const nonBlocked = statuses.filter((s) => s !== "Blocked Development");
//         const newStatusRandom = Math.random();
//         if (newStatusRandom < 0.30) {
//           status = "Available";
//         } else if (newStatusRandom < 0.50) {
//           status = "Unreleased";
//         } else if (newStatusRandom < 0.70) {
//           status = "Reserved";
//         } else if (newStatusRandom < 0.85) {
//           status = "Contracted";
//         } else if (newStatusRandom < 0.95) {
//           status = "Partner";
//         } else {
//           status = "Hold";
//         }
//       }
//     }

//     // Generate sellable area based on unit type
//     let minArea, maxArea;
//     switch (unitType) {
//       case "Studio":
//         minArea = 50;
//         maxArea = 75;
//         break;
//       case "1 Bedroom":
//         minArea = 75;
//         maxArea = 100;
//         break;
//       case "2 Bedroom":
//         minArea = 100;
//         maxArea = 125;
//         break;
//       case "3 Bedroom":
//         minArea = 125;
//         maxArea = 150;
//         break;
//       case "Penthouse":
//       case "Duplex":
//       case "Loft":
//         minArea = 150;
//         maxArea = 250;
//         break;
//       default:
//         minArea = 50;
//         maxArea = 100;
//     }

//     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
//     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
//     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier; // PSM between 15k and 25k, adjusted by company
//     const psm = Math.floor(psmBase);
//     const interestFreePrice = Math.floor(sellableArea * psmBase);
//     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

//     // Generate dates - realistic distribution up to current date (Jan 2026)
//     // Each year has SEVERAL months with data (not all 12)
//     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
//     let reservationDate = null;
    
//     if (hasReservation) {
//       const currentDate = new Date(2026, 0, 19); // Jan 19, 2026
//       const startDate = new Date(2020, 0, 1); // Jan 1, 2020
      
//       // Select a random year between 2020-2026 with weighting
//       const yearRandom = Math.random();
//       let selectedYear;
      
//       if (yearRandom < 0.40) {
//         selectedYear = 2025; // 40% in 2025 (most recent)
//       } else if (yearRandom < 0.65) {
//         selectedYear = 2024; // 25% in 2024
//       } else if (yearRandom < 0.80) {
//         selectedYear = 2023; // 15% in 2023
//       } else if (yearRandom < 0.90) {
//         selectedYear = 2022; // 10% in 2022
//       } else if (yearRandom < 0.96) {
//         selectedYear = 2021; // 6% in 2021
//       } else {
//         selectedYear = 2020; // 4% in 2020
//       }
      
//       // For each year, select from SEVERAL months (not all 12)
//       // This creates realistic patterns with some months having data, others empty
//       const activeMonths = {
//         2020: [0, 2, 5, 8, 11], // JAN, MAR, JUN, SEP, DEC (5 months)
//         2021: [1, 3, 4, 6, 9, 10], // FEB, APR, MAY, JUL, OCT, NOV (6 months)
//         2022: [0, 2, 4, 6, 8, 10], // JAN, MAR, MAY, JUL, SEP, NOV (6 months)
//         2023: [1, 3, 5, 7, 9, 11], // FEB, APR, JUN, AUG, OCT, DEC (6 months)
//         2024: [0, 1, 3, 4, 6, 7, 9, 10], // JAN, FEB, APR, MAY, JUL, AUG, OCT, NOV (8 months)
//         2025: [0, 1, 2, 4, 5, 7, 8, 10, 11], // JAN, FEB, MAR, MAY, JUN, AUG, SEP, NOV, DEC (9 months)
//         2026: [0] // JAN only (current month)
//       };
      
//       const monthsForYear = activeMonths[selectedYear];
//       const selectedMonth = monthsForYear[Math.floor(Math.random() * monthsForYear.length)];
//       const selectedDay = Math.floor(Math.random() * 28) + 1;
      
//       reservationDate = new Date(selectedYear, selectedMonth, selectedDay);
      
//       // Make sure we don't exceed current date
//       if (reservationDate > currentDate) {
//         reservationDate = currentDate;
//       }
//     }

//     // Contract delivery date - future dates (2024-2028) with SEVERAL months per year
//     const deliveryYearRandom = Math.random();
//     let deliveryYear;
    
//     if (deliveryYearRandom < 0.25) {
//       deliveryYear = 2025; // 25% in 2025
//     } else if (deliveryYearRandom < 0.50) {
//       deliveryYear = 2026; // 25% in 2026
//     } else if (deliveryYearRandom < 0.75) {
//       deliveryYear = 2027; // 25% in 2027
//     } else {
//       deliveryYear = 2028; // 25% in 2028
//     }
    
//     // For delivery, select from SEVERAL months (not all 12)
//     const deliveryActiveMonths = {
//       2025: [0, 2, 5, 8, 11], // JAN, MAR, JUN, SEP, DEC (5 months)
//       2026: [1, 3, 4, 6, 9, 10], // FEB, APR, MAY, JUL, OCT, NOV (6 months)
//       2027: [0, 2, 4, 6, 8, 10], // JAN, MAR, MAY, JUL, SEP, NOV (6 months)
//       2028: [1, 3, 5, 7, 9, 11] // FEB, APR, JUN, AUG, OCT, DEC (6 months)
//     };
    
//     const deliveryMonthsForYear = deliveryActiveMonths[deliveryYear];
//     const deliveryMonth = deliveryMonthsForYear[Math.floor(Math.random() * deliveryMonthsForYear.length)];
//     const deliveryDay = Math.floor(Math.random() * 28) + 1;
    
//     const contractDeliveryDate = new Date(deliveryYear, deliveryMonth, deliveryDay);
//     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months
//     const developmentDeliveryDate = new Date(contractDeliveryDate);
//     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)); // +/- 3 months variation

//     units.push({
//       id: i + 1,
//       city,
//       project,
//       project_name: project, // Add this for the modal
//       unit_type: unitType,
//       area_range: areaRange,
//       adj_status_2: status,
//       status,
//       sellable_area: sellableArea,
//       psm,
//       interest_free_unit_price: interestFreePrice,
//       sales_value: salesValue,
//       building_type: buildingType,
//       grace_period_months: gracePeriodMonths,
//       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
//       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
//       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
//       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
//       unit_model: unitModel,
//       adj_contract_payment_plan: paymentPlan,
//       // Add company-specific metadata from second code
//       company_id: companyId,
//       company_name: companyName
//     });
//   }

//   return units;
// };

// // Generate data for all companies
// const companies = [
//   { id: 1, name: "Skyline Developments" },
//   { id: 2, name: "Urban Properties Ltd" },
//   { id: 3, name: "Metro Construction" }
// ];

// // Pre-generate data for each company
// const companyDataCache = {};
// companies.forEach(company => {
//   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// });

// export const getCompanies = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(companies);
//     }, 100);
//   });
// };

// export const getCompanyUnits = (companyId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const id = parseInt(companyId);
//       const units = companyDataCache[id] || companyDataCache[1];
//       const company = companies.find(c => c.id === id);
      
//       console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
//       console.log(`Total units: ${units.length}`);
      
//       resolve({
//         units: units,
//         company: company
//       });
//     }, 300);
//   });
// };

// // For backward compatibility with the export structure
// const mockData = {
//   companies: companies,
//   getCompanyUnits: getCompanyUnits,
//   getCompanies: getCompanies
// };

// export default mockData;


// Mock data generator for inventory dashboard
// CORRECTED VERSION - Matches backend logic exactly

// const generateCompanySpecificUnits = (companyId, companyName) => {
//   // Company-specific configurations
//   const companyConfigs = {
//     1: { // Skyline Developments
//       projects: ["Skyline Towers", "Azure Heights", "Crystal Plaza", "Diamond Residence", "Emerald Gardens"],
//       cities: ["Cairo", "New Cairo", "6th October"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
//       numberOfUnits: 600,
//       priceMultiplier: 1.2,
//       areaMultiplier: 1.1
//     },
//     2: { // Urban Properties Ltd
//       projects: ["Urban Oasis", "Metropolitan Plaza", "City Hub", "Downtown Suites", "Urban Vista"],
//       cities: ["Alexandria", "New Alexandria", "Borg El Arab"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Loft"],
//       numberOfUnits: 450,
//       priceMultiplier: 1.0,
//       areaMultiplier: 1.0
//     },
//     3: { // Metro Construction
//       projects: ["Metro Park", "Central Station", "Transit Hub", "Metro Heights", "Railway Gardens"],
//       cities: ["Giza", "Sheikh Zayed", "New Giza"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
//       numberOfUnits: 550,
//       priceMultiplier: 0.9,
//       areaMultiplier: 0.95
//     }
//   };

//   const config = companyConfigs[companyId] || companyConfigs[1];
  
//   const projects = config.projects;
//   const cities = config.cities;
//   const unitTypes = config.unitTypes;
  
//   // ✅ CRITICAL FIX: Backend only has these statuses based on REQUIRED_FIELDS
//   // The backend uses "adj_status_2" and "status" fields
//   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
  
//   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
  
//   // ✅ CRITICAL FIX: Backend uses "adj_contract_payment_plan" with fallback to "contract_payment_plan"
//   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
  
//   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
//   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

//   // ✅ Make "Blocked Development" NOT exist everywhere - Company-specific restrictions
//   const blockedAllowedProjects = new Set([projects[0], projects[1]]); // First two projects can have blocked
//   const blockedAllowedCities = new Set([cities[0], cities[1]]); // First two cities
//   const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse", "Duplex", "Loft"]);
//   const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]);

//   const units = [];
//   const numberOfUnits = config.numberOfUnits;

//   for (let i = 0; i < numberOfUnits; i++) {
//     const project = projects[Math.floor(Math.random() * projects.length)];
//     const city = cities[Math.floor(Math.random() * cities.length)];
//     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
//     const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
//     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
//     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
//     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

//     // ✅ Weighted status distribution - MUCH more contracted units for less dashes
//     const statusRandom = Math.random();
//     let status;
//     if (statusRandom < 0.60) {
//       status = "Contracted"; // 60% contracted (was 35%)
//     } else if (statusRandom < 0.70) {
//       status = "Available"; // 10% available
//     } else if (statusRandom < 0.78) {
//       status = "Reserved"; // 8% reserved
//     } else if (statusRandom < 0.85) {
//       status = "Unreleased"; // 7% unreleased
//     } else if (statusRandom < 0.90) {
//       status = "Blocked Development"; // 5% blocked
//     } else if (statusRandom < 0.95) {
//       status = "Partner"; // 5% partner
//     } else {
//       status = "Hold"; // 5% hold
//     }

//     // ✅ Enforce restrictions for "Blocked Development"
//     if (status === "Blocked Development") {
//       const allowed =
//         blockedAllowedProjects.has(project) &&
//         blockedAllowedCities.has(city) &&
//         blockedAllowedUnitTypes.has(unitType) &&
//         blockedAllowedAreas.has(areaRange);

//       if (!allowed) {
//         // re-roll to a non-blocked status
//         const newStatusRandom = Math.random();
//         if (newStatusRandom < 0.30) {
//           status = "Available";
//         } else if (newStatusRandom < 0.50) {
//           status = "Unreleased";
//         } else if (newStatusRandom < 0.70) {
//           status = "Reserved";
//         } else if (newStatusRandom < 0.85) {
//           status = "Contracted";
//         } else if (newStatusRandom < 0.95) {
//           status = "Partner";
//         } else {
//           status = "Hold";
//         }
//       }
//     }

//     // Generate sellable area based on unit type
//     let minArea, maxArea;
//     switch (unitType) {
//       case "Studio":
//         minArea = 50;
//         maxArea = 75;
//         break;
//       case "1 Bedroom":
//         minArea = 75;
//         maxArea = 100;
//         break;
//       case "2 Bedroom":
//         minArea = 100;
//         maxArea = 125;
//         break;
//       case "3 Bedroom":
//         minArea = 125;
//         maxArea = 150;
//         break;
//       case "Penthouse":
//       case "Duplex":
//       case "Loft":
//         minArea = 150;
//         maxArea = 250;
//         break;
//       default:
//         minArea = 50;
//         maxArea = 100;
//     }

//     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
//     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
//     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier; // PSM between 15k and 25k, adjusted by company
//     const psm = Math.floor(psmBase);
//     const interestFreePrice = Math.floor(sellableArea * psmBase);
//     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

//     // Generate dates - realistic distribution up to current date (Jan 2026)
//     // Each year has SEVERAL months with data (not all 12)
//     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
//     let reservationDate = null;
    
//     if (hasReservation) {
//       const currentDate = new Date(2026, 0, 19); // Jan 19, 2026
//       const startDate = new Date(2020, 0, 1); // Jan 1, 2020
      
//       // Select a random year between 2020-2026 with weighting
//       const yearRandom = Math.random();
//       let selectedYear;
      
//       if (yearRandom < 0.40) {
//         selectedYear = 2025; // 40% in 2025 (most recent)
//       } else if (yearRandom < 0.65) {
//         selectedYear = 2024; // 25% in 2024
//       } else if (yearRandom < 0.80) {
//         selectedYear = 2023; // 15% in 2023
//       } else if (yearRandom < 0.90) {
//         selectedYear = 2022; // 10% in 2022
//       } else if (yearRandom < 0.96) {
//         selectedYear = 2021; // 6% in 2021
//       } else {
//         selectedYear = 2020; // 4% in 2020
//       }
      
//       // For each year, select from SEVERAL months (not all 12)
//       // This creates realistic patterns with some months having data, others empty
//       const activeMonths = {
//         2020: [0, 2, 5, 8, 11], // JAN, MAR, JUN, SEP, DEC (5 months)
//         2021: [1, 3, 4, 6, 9, 10], // FEB, APR, MAY, JUL, OCT, NOV (6 months)
//         2022: [0, 2, 4, 6, 8, 10], // JAN, MAR, MAY, JUL, SEP, NOV (6 months)
//         2023: [1, 3, 5, 7, 9, 11], // FEB, APR, JUN, AUG, OCT, DEC (6 months)
//         2024: [0, 1, 3, 4, 6, 7, 9, 10], // JAN, FEB, APR, MAY, JUL, AUG, OCT, NOV (8 months)
//         2025: [0, 1, 2, 4, 5, 7, 8, 10, 11], // JAN, FEB, MAR, MAY, JUN, AUG, SEP, NOV, DEC (9 months)
//         2026: [0] // JAN only (current month)
//       };
      
//       const monthsForYear = activeMonths[selectedYear];
//       const selectedMonth = monthsForYear[Math.floor(Math.random() * monthsForYear.length)];
//       const selectedDay = Math.floor(Math.random() * 28) + 1;
      
//       reservationDate = new Date(selectedYear, selectedMonth, selectedDay);
      
//       // Make sure we don't exceed current date
//       if (reservationDate > currentDate) {
//         reservationDate = currentDate;
//       }
//     }

//     // Contract delivery date - future dates (2024-2028) with SEVERAL months per year
//     const deliveryYearRandom = Math.random();
//     let deliveryYear;
    
//     if (deliveryYearRandom < 0.25) {
//       deliveryYear = 2025; // 25% in 2025
//     } else if (deliveryYearRandom < 0.50) {
//       deliveryYear = 2026; // 25% in 2026
//     } else if (deliveryYearRandom < 0.75) {
//       deliveryYear = 2027; // 25% in 2027
//     } else {
//       deliveryYear = 2028; // 25% in 2028
//     }
    
//     // For delivery, select from SEVERAL months (not all 12)
//     const deliveryActiveMonths = {
//       2025: [0, 2, 5, 8, 11], // JAN, MAR, JUN, SEP, DEC (5 months)
//       2026: [1, 3, 4, 6, 9, 10], // FEB, APR, MAY, JUL, OCT, NOV (6 months)
//       2027: [0, 2, 4, 6, 8, 10], // JAN, MAR, MAY, JUL, SEP, NOV (6 months)
//       2028: [1, 3, 5, 7, 9, 11] // FEB, APR, JUN, AUG, OCT, DEC (6 months)
//     };
    
//     const deliveryMonthsForYear = deliveryActiveMonths[deliveryYear];
//     const deliveryMonth = deliveryMonthsForYear[Math.floor(Math.random() * deliveryMonthsForYear.length)];
//     const deliveryDay = Math.floor(Math.random() * 28) + 1;
    
//     const contractDeliveryDate = new Date(deliveryYear, deliveryMonth, deliveryDay);
//     const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months
//     const developmentDeliveryDate = new Date(contractDeliveryDate);
//     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)); // +/- 3 months variation

//     // ✅ CRITICAL FIX: Match backend REQUIRED_FIELDS exactly
//     // Backend requires these exact field names - no extras, no missing
//     units.push({
//       // Required by backend in REQUIRED_FIELDS list
//       city,
//       project,
//       unit_type: unitType,
//       area_range: areaRange,
//       adj_status_2: status, // ✅ Backend requires this field
//       status, // ✅ Backend requires this field
//       sellable_area: sellableArea,
//       psm,
//       interest_free_unit_price: interestFreePrice,
//       building_type: buildingType,
//       grace_period_months: gracePeriodMonths,
//       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
//       sales_value: salesValue,
//       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
//       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
//       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
//       unit_model: unitModel,
      
//       // ✅ Backend has payment plan fallback logic:
//       // pp = getattr(unit, "adj_contract_payment_plan", None) or getattr(unit, "contract_payment_plan", None)
//       adj_contract_payment_plan: paymentPlan,
      
//       // Additional fields for frontend (not in backend REQUIRED_FIELDS but useful)
//       project_name: project, // For modal display
//       company_id: companyId,
//       company_name: companyName,
      
//       // ✅ Add this field which backend might have but we're using adj_contract_payment_plan as primary
//       contract_payment_plan: paymentPlan
//     });
//   }

//   return units;
// };

// // Generate data for all companies
// const companies = [
//   { id: 1, name: "Skyline Developments" },
//   { id: 2, name: "Urban Properties Ltd" },
//   { id: 3, name: "Metro Construction" }
// ];

// // Pre-generate data for each company
// const companyDataCache = {};
// companies.forEach(company => {
//   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// });

// export const getCompanies = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(companies);
//     }, 100);
//   });
// };

// export const getCompanyUnits = (companyId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const id = parseInt(companyId);
//       const units = companyDataCache[id] || companyDataCache[1];
//       const company = companies.find(c => c.id === id);
      
//       console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
//       console.log(`Total units: ${units.length}`);
      
//       // ✅ CRITICAL: Backend returns units in this exact structure
//       // Backend: return ServiceResult(success=True, status=200, payload={"units": filtered_units})
//       resolve({
//         units: units,
//         company: company
//       });
//     }, 300);
//   });
// };

// // For backward compatibility with the export structure
// const mockData = {
//   companies: companies,
//   getCompanyUnits: getCompanyUnits,
//   getCompanies: getCompanies
// };

// export default mockData;






// Mock data generator with REALISTIC SPARSE DATA
// Not all statuses exist in all projects/unit types/areas

// const generateCompanySpecificUnits = (companyId, companyName) => {
//   const companyConfigs = {
//     1: { // Skyline Developments
//       projects: ["Skyline Towers", "Azure Heights", "Crystal Plaza", "Diamond Residence", "Emerald Gardens"],
//       cities: ["Cairo", "New Cairo", "6th October"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
//       numberOfUnits: 600,
//       priceMultiplier: 1.2,
//       areaMultiplier: 1.1
//     },
//     2: { // Urban Properties Ltd
//       projects: ["Urban Oasis", "Metropolitan Plaza", "City Hub", "Downtown Suites", "Urban Vista"],
//       cities: ["Alexandria", "New Alexandria", "Borg El Arab"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Loft"],
//       numberOfUnits: 450,
//       priceMultiplier: 1.0,
//       areaMultiplier: 1.0
//     },
//     3: { // Metro Construction
//       projects: ["Metro Park", "Central Station", "Transit Hub", "Metro Heights", "Railway Gardens"],
//       cities: ["Giza", "Sheikh Zayed", "New Giza"],
//       unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
//       numberOfUnits: 550,
//       priceMultiplier: 0.9,
//       areaMultiplier: 0.95
//     }
//   };

//   const config = companyConfigs[companyId] || companyConfigs[1];
  
//   const projects = config.projects;
//   const cities = config.cities;
//   const unitTypes = config.unitTypes;
//   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
//   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
//   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
//   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
//   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

//   // ✅ REALISTIC BUSINESS RULES - Create sparse data patterns
  
//   // 1. Status restrictions by project (not all statuses in all projects)
//   const statusByProject = {
//     [projects[0]]: ["Available", "Reserved", "Contracted", "Partner"], // Skyline: 4 statuses
//     [projects[1]]: ["Available", "Unreleased", "Contracted"], // Azure: 3 statuses
//     [projects[2]]: ["Available", "Reserved", "Contracted", "Hold"], // Crystal: 4 statuses
//     [projects[3]]: ["Unreleased", "Blocked Development", "Reserved", "Contracted"], // Diamond: 4 statuses
//     [projects[4]]: ["Available", "Contracted", "Partner"], // Emerald: 3 statuses
//   };

//   // 2. Unit type restrictions by project
//   const unitTypesByProject = {
//     [projects[0]]: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"], // Skyline: No Duplex
//     [projects[1]]: ["1 Bedroom", "2 Bedroom", "3 Bedroom", "Duplex"], // Azure: No Studio/Penthouse
//     [projects[2]]: ["2 Bedroom", "3 Bedroom", "Penthouse"], // Crystal: Only larger units
//     [projects[3]]: ["Studio", "1 Bedroom", "2 Bedroom"], // Diamond: Only smaller units
//     [projects[4]]: ["2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"], // Emerald: Mid to large
//   };

//   // 3. Status restrictions by unit type
//   const statusByUnitType = {
//     "Studio": ["Available", "Reserved", "Contracted"], // Studios: no Partner/Hold
//     "1 Bedroom": ["Available", "Reserved", "Contracted", "Unreleased"],
//     "2 Bedroom": ["Available", "Reserved", "Contracted", "Partner"], // 2BR can be Partner
//     "3 Bedroom": ["Available", "Reserved", "Contracted", "Partner", "Hold"],
//     "Penthouse": ["Reserved", "Contracted", "Partner", "Hold"], // Penthouse: no Available
//     "Duplex": ["Reserved", "Contracted", "Blocked Development"],
//   };

//   // 4. City restrictions (not all projects in all cities)
//   const cityByProject = {
//     [projects[0]]: ["Cairo", "New Cairo"], // Skyline: 2 cities
//     [projects[1]]: ["New Cairo"], // Azure: 1 city only
//     [projects[2]]: ["Cairo", "6th October"], // Crystal: 2 cities
//     [projects[3]]: ["6th October"], // Diamond: 1 city only
//     [projects[4]]: ["Cairo", "New Cairo", "6th October"], // Emerald: all cities
//   };

//   // 5. Area restrictions by unit type
//   const areaByUnitType = {
//     "Studio": ["50-75 sqm", "75-100 sqm"],
//     "1 Bedroom": ["75-100 sqm", "100-125 sqm"],
//     "2 Bedroom": ["100-125 sqm", "125-150 sqm"],
//     "3 Bedroom": ["125-150 sqm", "150-200 sqm"],
//     "Penthouse": ["150-200 sqm", "200+ sqm"],
//     "Duplex": ["150-200 sqm", "200+ sqm"],
//   };

//   const units = [];
//   const numberOfUnits = config.numberOfUnits;

//   for (let i = 0; i < numberOfUnits; i++) {
//     // ✅ Select project first
//     const project = projects[Math.floor(Math.random() * projects.length)];
    
//     // ✅ City must be valid for this project
//     const validCities = cityByProject[project];
//     const city = validCities[Math.floor(Math.random() * validCities.length)];
    
//     // ✅ Unit type must be valid for this project
//     const validUnitTypes = unitTypesByProject[project];
//     const unitType = validUnitTypes[Math.floor(Math.random() * validUnitTypes.length)];
    
//     // ✅ Area must be valid for this unit type
//     const validAreas = areaByUnitType[unitType];
//     const areaRange = validAreas[Math.floor(Math.random() * validAreas.length)];
    
//     // ✅ Status must be valid for BOTH project AND unit type (intersection)
//     const validStatusesForProject = statusByProject[project];
//     const validStatusesForUnitType = statusByUnitType[unitType];
//     const validStatuses = validStatusesForProject.filter(s => validStatusesForUnitType.includes(s));
    
//     // If no valid statuses (shouldn't happen with proper data), default to Available
//     const status = validStatuses.length > 0 
//       ? validStatuses[Math.floor(Math.random() * validStatuses.length)]
//       : "Available";

//     const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
//     const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
//     const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

//     // Generate sellable area based on unit type
//     let minArea, maxArea;
//     switch (unitType) {
//       case "Studio":
//         minArea = 50;
//         maxArea = 75;
//         break;
//       case "1 Bedroom":
//         minArea = 75;
//         maxArea = 100;
//         break;
//       case "2 Bedroom":
//         minArea = 100;
//         maxArea = 125;
//         break;
//       case "3 Bedroom":
//         minArea = 125;
//         maxArea = 150;
//         break;
//       case "Penthouse":
//       case "Duplex":
//         minArea = 150;
//         maxArea = 250;
//         break;
//       default:
//         minArea = 50;
//         maxArea = 100;
//     }

//     const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
//     const sellableArea = Math.floor(baseArea * config.areaMultiplier);
//     const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier;
//     const psm = Math.floor(psmBase);
//     const interestFreePrice = Math.floor(sellableArea * psmBase);
//     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2));

//     // Generate dates
//     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
//     let reservationDate = null;
    
//     if (hasReservation) {
//       const currentDate = new Date(2026, 0, 19);
//       const yearRandom = Math.random();
//       let selectedYear;
      
//       if (yearRandom < 0.40) {
//         selectedYear = 2025;
//       } else if (yearRandom < 0.65) {
//         selectedYear = 2024;
//       } else if (yearRandom < 0.80) {
//         selectedYear = 2023;
//       } else if (yearRandom < 0.90) {
//         selectedYear = 2022;
//       } else if (yearRandom < 0.96) {
//         selectedYear = 2021;
//       } else {
//         selectedYear = 2020;
//       }
      
//       const activeMonths = {
//         2020: [0, 2, 5, 8, 11],
//         2021: [1, 3, 4, 6, 9, 10],
//         2022: [0, 2, 4, 6, 8, 10],
//         2023: [1, 3, 5, 7, 9, 11],
//         2024: [0, 1, 3, 4, 6, 7, 9, 10],
//         2025: [0, 1, 2, 4, 5, 7, 8, 10, 11],
//         2026: [0]
//       };
      
//       const monthsForYear = activeMonths[selectedYear];
//       const selectedMonth = monthsForYear[Math.floor(Math.random() * monthsForYear.length)];
//       const selectedDay = Math.floor(Math.random() * 28) + 1;
      
//       reservationDate = new Date(selectedYear, selectedMonth, selectedDay);
      
//       if (reservationDate > currentDate) {
//         reservationDate = currentDate;
//       }
//     }

//     // Contract delivery date
//     const deliveryYearRandom = Math.random();
//     let deliveryYear;
    
//     if (deliveryYearRandom < 0.25) {
//       deliveryYear = 2025;
//     } else if (deliveryYearRandom < 0.50) {
//       deliveryYear = 2026;
//     } else if (deliveryYearRandom < 0.75) {
//       deliveryYear = 2027;
//     } else {
//       deliveryYear = 2028;
//     }
    
//     const deliveryActiveMonths = {
//       2025: [0, 2, 5, 8, 11],
//       2026: [1, 3, 4, 6, 9, 10],
//       2027: [0, 2, 4, 6, 8, 10],
//       2028: [1, 3, 5, 7, 9, 11]
//     };
    
//     const deliveryMonthsForYear = deliveryActiveMonths[deliveryYear];
//     const deliveryMonth = deliveryMonthsForYear[Math.floor(Math.random() * deliveryMonthsForYear.length)];
//     const deliveryDay = Math.floor(Math.random() * 28) + 1;
    
//     const contractDeliveryDate = new Date(deliveryYear, deliveryMonth, deliveryDay);
//     const gracePeriodMonths = Math.floor(Math.random() * 7);
//     const developmentDeliveryDate = new Date(contractDeliveryDate);
//     developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3));

//     units.push({
//       city,
//       project,
//       unit_type: unitType,
//       area_range: areaRange,
//       adj_status_2: status,
//       status,
//       sellable_area: sellableArea,
//       psm,
//       interest_free_unit_price: interestFreePrice,
//       building_type: buildingType,
//       grace_period_months: gracePeriodMonths,
//       unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
//       sales_value: salesValue,
//       reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
//       development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
//       contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
//       unit_model: unitModel,
//       adj_contract_payment_plan: paymentPlan,
//       project_name: project,
//       company_id: companyId,
//       company_name: companyName,
//       contract_payment_plan: paymentPlan
//     });
//   }

//   return units;
// };

// // Generate data for all companies
// const companies = [
//   { id: 1, name: "Skyline Developments" },
//   { id: 2, name: "Urban Properties Ltd" },
//   { id: 3, name: "Metro Construction" }
// ];

// // Pre-generate data for each company
// const companyDataCache = {};
// companies.forEach(company => {
//   companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
// });

// export const getCompanies = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(companies);
//     }, 100);
//   });
// };

// export const getCompanyUnits = (companyId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const id = parseInt(companyId);
//       const units = companyDataCache[id] || companyDataCache[1];
//       const company = companies.find(c => c.id === id);
      
//       console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
//       console.log(`Total units: ${units.length}`);
      
//       resolve({
//         units: units,
//         company: company
//       });
//     }, 300);
//   });
// };

// const mockData = {
//   companies: companies,
//   getCompanyUnits: getCompanyUnits,
//   getCompanies: getCompanies
// };

// export default mockData;




// Mock data generator with STRICTLY ENFORCED sparse data patterns

const generateCompanySpecificUnits = (companyId, companyName) => {
  const companyConfigs = {
    1: { // Skyline Developments
      projects: ["Skyline Towers", "Azure Heights", "Crystal Plaza", "Diamond Residence", "Emerald Gardens"],
      cities: ["Cairo", "New Cairo", "6th October"],
      unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"],
      numberOfUnits: 600,
      priceMultiplier: 1.2,
      areaMultiplier: 1.1
    },
    2: { // Urban Properties Ltd
      projects: ["Urban Oasis", "Metropolitan Plaza", "City Hub", "Downtown Suites", "Urban Vista"],
      cities: ["Alexandria", "New Alexandria", "Borg El Arab"],
      unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Loft"],
      numberOfUnits: 450,
      priceMultiplier: 1.0,
      areaMultiplier: 1.0
    },
    3: { // Metro Construction
      projects: ["Metro Park", "Central Station", "Transit Hub", "Metro Heights", "Railway Gardens"],
      cities: ["Giza", "Sheikh Zayed", "New Giza"],
      unitTypes: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"],
      numberOfUnits: 550,
      priceMultiplier: 0.9,
      areaMultiplier: 0.95
    }
  };

  const config = companyConfigs[companyId] || companyConfigs[1];
  
  const projects = config.projects;
  const cities = config.cities;
  const unitTypes = config.unitTypes;
  const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
  const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
  const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
  const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
  const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

  // ✅ STRICT BUSINESS RULES - These define what combinations are POSSIBLE
  
  // 1. Status restrictions by project (not all statuses in all projects)
  const statusByProject = {
    [projects[0]]: ["Available", "Reserved", "Contracted", "Partner"], // Skyline: Has Partner ✅
    [projects[1]]: ["Available", "Unreleased", "Contracted"], // Azure: NO Partner ❌
    [projects[2]]: ["Available", "Reserved", "Contracted", "Hold"], // Crystal: NO Partner ❌
    [projects[3]]: ["Unreleased", "Blocked Development", "Reserved", "Contracted"], // Diamond: NO Partner ❌
    [projects[4]]: ["Available", "Contracted", "Partner"], // Emerald: Has Partner ✅
  };

  // 2. Unit type restrictions by project
  const unitTypesByProject = {
    [projects[0]]: ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"], // Skyline: No Duplex
    [projects[1]]: ["1 Bedroom", "2 Bedroom", "3 Bedroom", "Duplex"], // Azure: No Studio/Penthouse
    [projects[2]]: ["2 Bedroom", "3 Bedroom", "Penthouse"], // Crystal: Only larger units
    [projects[3]]: ["Studio", "1 Bedroom", "2 Bedroom"], // Diamond: Only smaller units
    [projects[4]]: ["2 Bedroom", "3 Bedroom", "Penthouse", "Duplex"], // Emerald: Mid to large
  };

  // 3. Status restrictions by unit type (CRITICAL FOR PARTNER)
  const statusByUnitType = {
    "Studio": ["Available", "Reserved", "Contracted"], // Studios: NO Partner ❌
    "1 Bedroom": ["Available", "Reserved", "Contracted", "Unreleased"], // 1BR: NO Partner ❌
    "2 Bedroom": ["Available", "Reserved", "Contracted", "Partner"], // 2BR: Has Partner ✅
    "3 Bedroom": ["Available", "Reserved", "Contracted", "Partner", "Hold"], // 3BR: Has Partner ✅
    "Penthouse": ["Reserved", "Contracted", "Partner", "Hold"], // Penthouse: Has Partner ✅
    "Duplex": ["Reserved", "Contracted", "Blocked Development"], // Duplex: NO Partner ❌
  };

  // 4. City restrictions (not all projects in all cities)
  const cityByProject = {
    [projects[0]]: ["Cairo", "New Cairo"], // Skyline: 2 cities
    [projects[1]]: ["New Cairo"], // Azure: 1 city only
    [projects[2]]: ["Cairo", "6th October"], // Crystal: 2 cities
    [projects[3]]: ["6th October"], // Diamond: 1 city only
    [projects[4]]: ["Cairo", "New Cairo", "6th October"], // Emerald: all cities
  };

  // 5. Area restrictions by unit type
  const areaByUnitType = {
    "Studio": ["50-75 sqm", "75-100 sqm"],
    "1 Bedroom": ["75-100 sqm", "100-125 sqm"],
    "2 Bedroom": ["100-125 sqm", "125-150 sqm"],
    "3 Bedroom": ["125-150 sqm", "150-200 sqm"],
    "Penthouse": ["150-200 sqm", "200+ sqm"],
    "Duplex": ["150-200 sqm", "200+ sqm"],
  };

  const units = [];
  const numberOfUnits = config.numberOfUnits;

  // ✅ WEIGHTED DISTRIBUTION: More units in common combinations
  const projectWeights = [0.25, 0.20, 0.20, 0.20, 0.15]; // Skyline gets most units
  const cumulativeProjectWeights = projectWeights.reduce((acc, w, i) => {
    acc.push((acc[i - 1] || 0) + w);
    return acc;
  }, []);

  for (let i = 0; i < numberOfUnits; i++) {
    // ✅ Select project with weighted distribution
    const projectRandom = Math.random();
    let projectIndex = 0;
    for (let j = 0; j < cumulativeProjectWeights.length; j++) {
      if (projectRandom < cumulativeProjectWeights[j]) {
        projectIndex = j;
        break;
      }
    }
    const project = projects[projectIndex];
    
    // ✅ City must be valid for this project
    const validCities = cityByProject[project];
    const city = validCities[Math.floor(Math.random() * validCities.length)];
    
    // ✅ Unit type must be valid for this project
    const validUnitTypes = unitTypesByProject[project];
    const unitType = validUnitTypes[Math.floor(Math.random() * validUnitTypes.length)];
    
    // ✅ Area must be valid for this unit type
    const validAreas = areaByUnitType[unitType];
    const areaRange = validAreas[Math.floor(Math.random() * validAreas.length)];
    
    // ✅ CRITICAL: Status must be valid for BOTH project AND unit type (intersection)
    const validStatusesForProject = statusByProject[project];
    const validStatusesForUnitType = statusByUnitType[unitType];
    const validStatuses = validStatusesForProject.filter(s => validStatusesForUnitType.includes(s));
    
    // If no valid statuses (shouldn't happen with proper data), default to Available
    if (validStatuses.length === 0) {
      console.warn(`No valid statuses for ${project} + ${unitType}, skipping unit`);
      continue;
    }
    
    // ✅ Weighted status distribution within valid statuses
    let status;
    if (validStatuses.includes("Contracted") && Math.random() < 0.55) {
      status = "Contracted"; // 55% if available
    } else if (validStatuses.includes("Available") && Math.random() < 0.25) {
      status = "Available"; // 25% if available
    } else if (validStatuses.includes("Partner") && Math.random() < 0.10) {
      status = "Partner"; // 10% if available (RARE!)
    } else if (validStatuses.includes("Reserved") && Math.random() < 0.15) {
      status = "Reserved"; // 15% if available
    } else {
      // Pick randomly from remaining valid statuses
      status = validStatuses[Math.floor(Math.random() * validStatuses.length)];
    }

    const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
    const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

    // Generate sellable area based on unit type
    let minArea, maxArea;
    switch (unitType) {
      case "Studio":
        minArea = 50;
        maxArea = 75;
        break;
      case "1 Bedroom":
        minArea = 75;
        maxArea = 100;
        break;
      case "2 Bedroom":
        minArea = 100;
        maxArea = 125;
        break;
      case "3 Bedroom":
        minArea = 125;
        maxArea = 150;
        break;
      case "Penthouse":
      case "Duplex":
        minArea = 150;
        maxArea = 250;
        break;
      default:
        minArea = 50;
        maxArea = 100;
    }

    const baseArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
    const sellableArea = Math.floor(baseArea * config.areaMultiplier);
    const psmBase = (15000 + Math.random() * 10000) * config.priceMultiplier;
    const psm = Math.floor(psmBase);
    const interestFreePrice = Math.floor(sellableArea * psmBase);
    const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2));

    // Generate dates
    const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
    let reservationDate = null;
    
    if (hasReservation) {
      const currentDate = new Date(2026, 0, 19);
      const yearRandom = Math.random();
      let selectedYear;
      
      if (yearRandom < 0.40) {
        selectedYear = 2025;
      } else if (yearRandom < 0.65) {
        selectedYear = 2024;
      } else if (yearRandom < 0.80) {
        selectedYear = 2023;
      } else if (yearRandom < 0.90) {
        selectedYear = 2022;
      } else if (yearRandom < 0.96) {
        selectedYear = 2021;
      } else {
        selectedYear = 2020;
      }
      
      const activeMonths = {
        2020: [0, 2, 5, 8, 11],
        2021: [1, 3, 4, 6, 9, 10],
        2022: [0, 2, 4, 6, 8, 10],
        2023: [1, 3, 5, 7, 9, 11],
        2024: [0, 1, 3, 4, 6, 7, 9, 10],
        2025: [0, 1, 2, 4, 5, 7, 8, 10, 11],
        2026: [0]
      };
      
      const monthsForYear = activeMonths[selectedYear];
      const selectedMonth = monthsForYear[Math.floor(Math.random() * monthsForYear.length)];
      const selectedDay = Math.floor(Math.random() * 28) + 1;
      
      reservationDate = new Date(selectedYear, selectedMonth, selectedDay);
      
      if (reservationDate > currentDate) {
        reservationDate = currentDate;
      }
    }

    // Contract delivery date
    const deliveryYearRandom = Math.random();
    let deliveryYear;
    
    if (deliveryYearRandom < 0.25) {
      deliveryYear = 2025;
    } else if (deliveryYearRandom < 0.50) {
      deliveryYear = 2026;
    } else if (deliveryYearRandom < 0.75) {
      deliveryYear = 2027;
    } else {
      deliveryYear = 2028;
    }
    
    const deliveryActiveMonths = {
      2025: [0, 2, 5, 8, 11],
      2026: [1, 3, 4, 6, 9, 10],
      2027: [0, 2, 4, 6, 8, 10],
      2028: [1, 3, 5, 7, 9, 11]
    };
    
    const deliveryMonthsForYear = deliveryActiveMonths[deliveryYear];
    const deliveryMonth = deliveryMonthsForYear[Math.floor(Math.random() * deliveryMonthsForYear.length)];
    const deliveryDay = Math.floor(Math.random() * 28) + 1;
    
    const contractDeliveryDate = new Date(deliveryYear, deliveryMonth, deliveryDay);
    const gracePeriodMonths = Math.floor(Math.random() * 7);
    const developmentDeliveryDate = new Date(contractDeliveryDate);
    developmentDeliveryDate.setMonth(developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3));

    units.push({
      city,
      project,
      unit_type: unitType,
      area_range: areaRange,
      adj_status_2: status,
      status,
      sellable_area: sellableArea,
      psm,
      interest_free_unit_price: interestFreePrice,
      building_type: buildingType,
      grace_period_months: gracePeriodMonths,
      unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
      sales_value: salesValue,
      reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
      development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
      contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
      unit_model: unitModel,
      adj_contract_payment_plan: paymentPlan,
      project_name: project,
      company_id: companyId,
      company_name: companyName,
      contract_payment_plan: paymentPlan
    });
  }

  // ✅ Log statistics for verification
  console.log(`Generated ${units.length} units for ${companyName}`);
  console.log('Partner units by project:', {
    [projects[0]]: units.filter(u => u.status === 'Partner' && u.project === projects[0]).length,
    [projects[1]]: units.filter(u => u.status === 'Partner' && u.project === projects[1]).length,
    [projects[2]]: units.filter(u => u.status === 'Partner' && u.project === projects[2]).length,
    [projects[3]]: units.filter(u => u.status === 'Partner' && u.project === projects[3]).length,
    [projects[4]]: units.filter(u => u.status === 'Partner' && u.project === projects[4]).length,
  });
  console.log('Partner units by type:', {
    'Studio': units.filter(u => u.status === 'Partner' && u.unit_type === 'Studio').length,
    '1 Bedroom': units.filter(u => u.status === 'Partner' && u.unit_type === '1 Bedroom').length,
    '2 Bedroom': units.filter(u => u.status === 'Partner' && u.unit_type === '2 Bedroom').length,
    '3 Bedroom': units.filter(u => u.status === 'Partner' && u.unit_type === '3 Bedroom').length,
    'Penthouse': units.filter(u => u.status === 'Partner' && u.unit_type === 'Penthouse').length,
    'Duplex': units.filter(u => u.status === 'Partner' && u.unit_type === 'Duplex').length,
  });

  return units;
};

// Generate data for all companies
const companies = [
  { id: 1, name: "Mint" },
  { id: 2, name: "Palmier Developments" },
  { id: 3, name: "IGI Developments" }
];

// Pre-generate data for each company
const companyDataCache = {};
companies.forEach(company => {
  companyDataCache[company.id] = generateCompanySpecificUnits(company.id, company.name);
});

export const getCompanies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(companies);
    }, 100);
  });
};

export const getCompanyUnits = (companyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = parseInt(companyId);
      const units = companyDataCache[id] || companyDataCache[1];
      const company = companies.find(c => c.id === id);
      
      console.log(`Loading data for company: ${company?.name} (ID: ${id})`);
      console.log(`Total units: ${units.length}`);
      
      resolve({
        units: units,
        company: company
      });
    }, 300);
  });
};

const mockData = {
  companies: companies,
  getCompanyUnits: getCompanyUnits,
  getCompanies: getCompanies
};

export default mockData;