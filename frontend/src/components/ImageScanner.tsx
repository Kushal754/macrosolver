import { useState, type ChangeEvent } from 'react';

// 1. Definimos las "formas" de los datos para que TypeScript no se queje
interface TargetMacros {
  protein: number;
  carbs: number;
  fats: number;
}

interface ResultData {
  success: boolean;
  recipe: string;
  grams: Record<string, number>;
}

interface ImageScannerProps {
  targetMacros: TargetMacros;
}

export const ImageScanner = ({ targetMacros }: ImageScannerProps) => {
  const [loading, setLoading] = useState(false);
  // 2. Le decimos explícitamente que 'result' puede ser ResultData o nulo
  const [result, setResult] = useState<ResultData | null>(null);

  // 3. Tipamos el evento del input como un cambio en un elemento HTML
  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    // Usamos ?. por seguridad por si no hay archivos
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('targetMacros', JSON.stringify(targetMacros || { protein: 0, carbs: 0, fats: 0 }));

      const response = await fetch('http://localhost:3000/vision/calculate', {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) throw new Error("Fallo en el servidor");

      const data = await response.json();
      
      setResult(data);
      console.log("Respuesta de la IA Visual:", data);

    } catch (error) {
      console.error("Error al subir la imagen:", error);
      alert("Hubo un error procesando la imagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mt-4">
      <h3 className="text-xl font-bold mb-4">📸 Escáner Visual de Macros</h3>
      
      <div className="mb-4">
        <label className="block bg-blue-600 text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition">
          {loading ? "Analizando imagen con IA..." : "Sube una foto de tu nevera o plato"}
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg" 
            onChange={handleImageUpload} 
            className="hidden" 
            disabled={loading}
          />
        </label>
      </div>

      {result && result.success && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <h4 className="font-bold text-green-800">✅ ¡Ingredientes detectados y calculados!</h4>
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{result.recipe}</p>
          
          <h5 className="font-bold mt-4">Cantidades exactas:</h5>
          <ul className="list-disc pl-5 mt-2">
            {Object.entries(result.grams).map(([ingrediente, cantidad]) => (
              <li key={ingrediente}>{ingrediente}: <strong>{cantidad}g</strong></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};