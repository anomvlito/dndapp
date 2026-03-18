import { CharacterRepository } from '../../lib/db/repository';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      if (id) {
        const char = await CharacterRepository.getById(id);
        return res.status(200).json(char);
      }
      const chars = await CharacterRepository.getAll();
      return res.status(200).json(chars);
    }

    if (req.method === 'POST') {
      const newId = await CharacterRepository.create(req.body);
      return res.status(201).json({ id: newId, success: true });
    }

    if (req.method === 'PATCH') {
      const { type, data } = req.body;
      if (!id) return res.status(400).json({ error: 'Falta ID' });

      if (type === 'stats') {
        await CharacterRepository.updateStats(id, data);
      } else if (type === 'hp') {
        await CharacterRepository.updateHP(id, data.current, data.temp);
      } else if (type === 'basics') {
        await CharacterRepository.updateBasics(id, data);
      }
      
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error del servidor', details: err.message });
  }
}
