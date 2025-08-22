import apiRequest from './config';

// GET sans token
const fetchItems = async () => {
  try {
    const items = await apiRequest({ method: 'GET', endpoint: '/items' });
    console.log(items);
  } catch (error) {
    console.error('Erreur lors de la récupération des items:', error);
  }
};

// POST avec token
const addItem = async (itemData: any, token: string) => {
  try {
    const newItem = await apiRequest({
      method: 'POST',
      endpoint: '/items',
      data: itemData,
      token: token,
    });
    console.log('Item ajouté:', newItem);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'item:", error);
  }
};

// PUT avec token et ID
const updateItem = async (itemId: number, updateData: any, token: string) => {
  try {
    const updatedItem = await apiRequest({
      method: 'PUT',
      endpoint: '/items',
      id: itemId,
      data: updateData,
      token: token,
    });
    console.log('Item mis à jour:', updatedItem);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'item:", error);
  }
};

// DELETE avec token et ID
const deleteItem = async (itemId: number, token: string) => {
  try {
    const deleted = await apiRequest({
      method: 'DELETE',
      endpoint: '/items',
      id: itemId,
      token: token,
    });
    console.log('Item supprimé:', deleted);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'item:", error);
  }
};

export { deleteItem, updateItem, addItem, fetchItems };
