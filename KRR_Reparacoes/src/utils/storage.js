import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@krr_services';

export const saveService = async (service) => {
  try {
    const existingServices = await getServices();
    const newService = {
      ...service,
      data: new Date().toISOString(),
    };
    const updatedServices = [...existingServices, newService];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
    return true;
  } catch (error) {
    console.error('Erro ao salvar serviço:', error);
    return false;
  }
};

export const getServices = async () => {
  try {
    const services = await AsyncStorage.getItem(STORAGE_KEY);
    return services ? JSON.parse(services) : [];
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return [];
  }
};

export const updateServiceStatus = async (serviceDate, newStatus) => {
  try {
    const services = await getServices();
    const idx = services.findIndex(s => s.data === serviceDate);
    if (idx !== -1) {
      services[idx].status = newStatus;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(services));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    return false;
  }
};

export const getServicesByMonth = (services, month) => {
  return services.filter(service => {
    const serviceDate = new Date(service.data);
    return serviceDate.getMonth() === month;
  });
};

export const calculateTotalValue = (services) => {
  return services.reduce((total, service) => total + Number(service.valor), 0);
}; 
export const updateService = async (updatedService) => {
  try {
    const services = await getServices();
    const index = services.findIndex(s => s.data === updatedService.data);
    if (index !== -1) {
      services[index] = updatedService;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(services));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    return false;
  }
};

export const deleteService = async (serviceDate) => {
  try {
    const services = await getServices();
    const updatedServices = services.filter(s => s.data !== serviceDate);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedServices));
    return true;
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    return false;
  }
};