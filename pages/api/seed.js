import dbConnect from "../../lib/dbConnect";
import Concern from "../../models/Concern";
import Treatment from "../../models/Treatment";
import ConcernTreatment from "../../models/ConcernTreatment";
import Package from "../../models/Package";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();
    // console.log("SEEDING DATA - Connected to DB");

    // Seed data
    const concernData = ["acne scars", "dark circles", "double chin"];
    const treatmentData = [
      "Microneedling",
      "Chemical Peel",
      "Laser Resurfacing",
      "Under-eye Filler",
      "PRP Under-eye",
      "HIFU",
      "Kybella",
    ];

    // Remove old data
    await Concern.deleteMany({});
    await Treatment.deleteMany({});
    await ConcernTreatment.deleteMany({});
    await Package.deleteMany({});
    console.log("Old data cleared");

    // Seed concerns
    console.log("Inserting concerns...");
    const concerns = await Concern.insertMany(
      concernData.map((name) => ({ name }))
    );
    console.log("Concerns inserted:", concerns.length);

    // Seed treatments
    const treatments = await Treatment.insertMany(
      treatmentData.map((name) => ({ name }))
    );

    // Map concerns to treatments
    const concernMap = Object.fromEntries(concerns.map((c) => [c.name, c._id]));
    const treatmentMap = Object.fromEntries(
      treatments.map((t) => [t.name, t._id])
    );

    // Example mapping
    const mapping = [
      ["acne scars", ["Microneedling", "Chemical Peel", "Laser Resurfacing"]],
      ["dark circles", ["Under-eye Filler", "PRP Under-eye"]],
      ["double chin", ["HIFU", "Kybella"]],
    ];

    let concernTreatments = [];
    mapping.forEach(([concern, treatList]) => {
      treatList.forEach((treatName) => {
        concernTreatments.push({
          concern: concernMap[concern],
          treatment: treatmentMap[treatName],
        });
      });
    });

    await ConcernTreatment.insertMany(concernTreatments);

    // Sample packages
    const packages = await Package.insertMany([
      {
        clinic_name: "Glow Clinic",
        package_name: "PRP Under-eye Rejuvenation",
        treatment: treatmentMap["PRP Under-eye"],
        price: 3500,
      },
      {
        clinic_name: "Aesthetic Center",
        package_name: "HIFU Chin Sculpt",
        treatment: treatmentMap["HIFU"],
        price: 7000,
      },
      {
        clinic_name: "Skin Care Hub",
        package_name: "Advanced Microneedling",
        treatment: treatmentMap["Microneedling"],
        price: 5500,
      },
      {
        clinic_name: "Laser Beauty",
        package_name: "Laser Resurfacing Pro",
        treatment: treatmentMap["Laser Resurfacing"],
        price: 9500,
      },
      {
        clinic_name: "Dermaview",
        package_name: "Under-eye Filler Special",
        treatment: treatmentMap["Under-eye Filler"],
        price: 6000,
      },
      {
        clinic_name: "Glow Clinic",
        package_name: "Chemical Peel Classic",
        treatment: treatmentMap["Chemical Peel"],
        price: 4000,
      },
    ]);
    console.log("Packages inserted:", packages.length);

    console.log("SEEDING COMPLETE!");
    return res.status(200).json({ 
      success: true, 
      message: "Database seeded successfully",
      counts: {
        concerns: concerns.length,
        treatments: treatments.length,
        mappings: concernTreatments.length,
        packages: packages.length
      }
    });

  } catch (error) {
    console.error("Seeding error:", error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
