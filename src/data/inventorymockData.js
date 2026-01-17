
// // Mock data generator for inventory dashboard

// const generateMockUnits = () => {
//   const companies = [
//     { id: 1, name: "Mint" },
//     { id: 2, name: "Palmier Developments" },
//     { id: 3, name: "IGI Developments" }
//   ];

//   const projects = ["Ocean View", "City Center", "Green Hills", "Riverside Tower", "Palm Residences"];
//   const cities = ["Cairo", "Alexandria", "Giza", "Hurghada"];
//   const unitTypes = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"];
//   const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
//   const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
//   const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
//   const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
//   const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

//   const units = [];
//   const numberOfUnits = 500;

//   for (let i = 0; i < numberOfUnits; i++) {
//     const project = projects[Math.floor(Math.random() * projects.length)];
//     const city = cities[Math.floor(Math.random() * cities.length)];
//     const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
//     const status = statuses[Math.floor(Math.random() * statuses.length)];
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

//     const sellableArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
//     const psmBase = 15000 + Math.random() * 10000; // PSM between 15k and 25k
//     const psm = Math.floor(psmBase);
//     const interestFreePrice = Math.floor(sellableArea * psmBase);
//     const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

//     // Generate dates
//     const hasReservation = ['Contracted', 'Reserved', 'Hold', 'Partner'].includes(status);
//     const reservationDate = hasReservation
//       ? new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
//       : null;

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
//       adj_contract_payment_plan: paymentPlan
//     });
//   }

//   return { companies, units };
// };

// const mockData = generateMockUnits();

// export const getCompanies = () => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(mockData.companies);
//     }, 100);
//   });
// };

// export const getCompanyUnits = (companyId) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         units: mockData.units,
//         company: mockData.companies.find(c => c.id === parseInt(companyId))
//       });
//     }, 300);
//   });
// };

// export default mockData;







// Mock data generator for inventory dashboard

const generateMockUnits = () => {
  const companies = [
    { id: 1, name: "Mint" },
    { id: 2, name: "Palmier Developments" },
    { id: 3, name: "IGI Developments" }
  ];

  const projects = ["Ocean View", "City Center", "Green Hills", "Riverside Tower", "Palm Residences"];
  const cities = ["Cairo", "Alexandria", "Giza", "Hurghada"];
  const unitTypes = ["Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"];
  const statuses = ["Available", "Unreleased", "Blocked Development", "Reserved", "Contracted", "Partner", "Hold"];
  const areaRanges = ["50-75 sqm", "75-100 sqm", "100-125 sqm", "125-150 sqm", "150-200 sqm", "200+ sqm"];
  const paymentPlans = ["cash", "01 yr", "02 yr", "03 yr", "04 yr", "05 yr", "06 yr", "07 yr"];
  const buildingTypes = ["Tower", "Villa", "Duplex", "Apartment"];
  const unitModels = ["Model A", "Model B", "Model C", "Model D", "Model E"];

  // ✅ Make "Blocked Development" NOT exist everywhere
  // Adjust these sets to match your real-life expectation.
 const blockedAllowedProjects = new Set(["Ocean View", "City Center"]);
blockedAllowedProjects.add("Palm Residences", "Green Hills");
  const blockedAllowedCities = new Set(["Cairo", "Giza"]); // only these cities can have blocked
  const blockedAllowedUnitTypes = new Set(["2 Bedroom", "3 Bedroom", "Penthouse"]); // optional restriction
  const blockedAllowedAreas = new Set(["125-150 sqm", "150-200 sqm", "200+ sqm"]); // optional restriction

  const units = [];
  const numberOfUnits = 500;

  for (let i = 0; i < numberOfUnits; i++) {
    const project = projects[Math.floor(Math.random() * projects.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const unitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
    const areaRange = areaRanges[Math.floor(Math.random() * areaRanges.length)];
    const paymentPlan = paymentPlans[Math.floor(Math.random() * paymentPlans.length)];
    const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
    const unitModel = unitModels[Math.floor(Math.random() * unitModels.length)];

    // ✅ Pick status, but enforce restrictions for "Blocked Development"
    let status = statuses[Math.floor(Math.random() * statuses.length)];

    if (status === "Blocked Development") {
      const allowed =
        blockedAllowedProjects.has(project) &&
        blockedAllowedCities.has(city) &&
        blockedAllowedUnitTypes.has(unitType) &&
        blockedAllowedAreas.has(areaRange);

      if (!allowed) {
        // re-roll to a non-blocked status
        const nonBlocked = statuses.filter((s) => s !== "Blocked Development");
        status = nonBlocked[Math.floor(Math.random() * nonBlocked.length)];
      }
    }

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
        minArea = 150;
        maxArea = 250;
        break;
      default:
        minArea = 50;
        maxArea = 100;
    }

    const sellableArea = Math.floor(Math.random() * (maxArea - minArea + 1)) + minArea;
    const psmBase = 15000 + Math.random() * 10000; // PSM between 15k and 25k
    const psm = Math.floor(psmBase);
    const interestFreePrice = Math.floor(sellableArea * psmBase);
    const salesValue = Math.floor(interestFreePrice * (1 + Math.random() * 0.2)); // 0-20% markup

    // Generate dates
    const hasReservation = ["Contracted", "Reserved", "Hold", "Partner"].includes(status);
    const reservationDate = hasReservation
      ? new Date(
          2020 + Math.floor(Math.random() * 5),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        )
      : null;

    const contractDeliveryDate = new Date(
      2024 + Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );

    const gracePeriodMonths = Math.floor(Math.random() * 7); // 0-6 months

    const developmentDeliveryDate = new Date(contractDeliveryDate);
    developmentDeliveryDate.setMonth(
      developmentDeliveryDate.getMonth() + gracePeriodMonths + Math.floor(Math.random() * 6 - 3)
    ); // +/- 3 months variation

    units.push({
      id: i + 1,
      city,
      project,
      project_name: project,
      unit_type: unitType,
      area_range: areaRange,
      adj_status_2: status,
      status,
      sellable_area: sellableArea,
      psm,
      interest_free_unit_price: interestFreePrice,
      sales_value: salesValue,
      building_type: buildingType,
      grace_period_months: gracePeriodMonths,
      unit_code: `${project.replace(/\s/g, '')}_${String(i + 1).padStart(4, '0')}`,
      reservation_date: reservationDate ? reservationDate.toISOString().split('T')[0] : null,
      development_delivery_date: developmentDeliveryDate.toISOString().split('T')[0],
      contract_delivery_date: contractDeliveryDate.toISOString().split('T')[0],
      unit_model: unitModel,
      adj_contract_payment_plan: paymentPlan
    });
  }

  return { companies, units };
};

const mockData = generateMockUnits();

export const getCompanies = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.companies);
    }, 100);
  });
};

export const getCompanyUnits = (companyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        units: mockData.units,
        company: mockData.companies.find((c) => c.id === parseInt(companyId))
      });
    }, 300);
  });
};

export default mockData;
