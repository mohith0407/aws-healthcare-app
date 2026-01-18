// upload_data.js
const API_URL = "https://okcj2jwv8a.execute-api.ap-south-1.amazonaws.com/dev/doctors";

const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Wilson",
    specialization: "Cardiologist",
    experience: "12 Years",
    fee: "$120",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    id: "2",
    name: "Dr. James Carter",
    specialization: "Dermatologist",
    experience: "8 Years",
    fee: "$90",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
  },
  {
    id: "3",
    name: "Dr. Emily Chen",
    specialization: "Neurologist",
    experience: "15 Years",
    fee: "$150",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
  }
];

async function seed() {
  console.log(`🌱 Uploading doctors to: ${API_URL}...`);

  for (const doc of doctors) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });

      if (response.ok) {
        console.log(`✅ Uploaded: ${doc.name}`);
      } else {
        console.error(`❌ Failed: ${doc.name}`, await response.text());
      }
    } catch (error) {
      console.error(`❌ Error uploading ${doc.name}:`, error.message);
    }
  }
  console.log("✨ Seeding Complete!");
}

seed();