fetch("http://localhost:3000/api/seed", { method: "POST" })
  .then((r) => r.json())
  .then((data) => {
    console.log(data.message || data);
  })
  .catch((err) => {
    console.error("Seed failed. Is the dev server running? Run: npm run dev");
    console.error(err.message);
  });
