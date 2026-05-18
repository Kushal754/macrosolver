
const peticion = {
  
  targetMacros: { protein: 40, carbs: 50, fats: 15 },
  
  
  ingredients: [
    { name: "Pollo", macros: { protein: 31, carbs: 0, fats: 3.6 } },
    { name: "Arroz", macros: { protein: 2.7, carbs: 28, fats: 0.3 } },
    { name: "Aceite_Oliva", macros: { protein: 0, carbs: 0, fats: 100 } }
  ]
};


console.log("⏳ Enviando datos al servidor...");

fetch('http://localhost:3000/api/calculate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(peticion)
})
  .then(respuesta => respuesta.json())
  .then(datos => {
    console.log("✅ ¡El servidor ha respondido!");
    console.log(JSON.stringify(datos, null, 2)); 
  })
  .catch(error => console.error("❌ Error de conexión:", error));