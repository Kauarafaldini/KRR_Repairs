import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { getServices, updateServiceStatus, getServicesByMonth, calculateTotalValue, deleteService } from '../utils/storage';
import { useFocusEffect } from '@react-navigation/native';

const months = [
  { label: 'Janeiro', value: 0 },
  { label: 'Fevereiro', value: 1 },
  { label: 'Março', value: 2 },
  { label: 'Abril', value: 3 },
  { label: 'Maio', value: 4 },
  { label: 'Junho', value: 5 },
  { label: 'Julho', value: 6 },
  { label: 'Agosto', value: 7 },
  { label: 'Setembro', value: 8 },
  { label: 'Outubro', value: 9 },
  { label: 'Novembro', value: 10 },
  { label: 'Dezembro', value: 11 },
];

export default function Dashboard({ navigation }) {
  const [services, setServices] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const loadServices = async () => {
    const allServices = await getServices();
    setServices(allServices);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadServices();
    }, [])
  );

  const handleStatusEdit = async (service, currentStatus) => {
    const newStatus = currentStatus === 'Lançado' ? 'Não Lançado' : 'Lançado';
    const success = await updateServiceStatus(service.data, newStatus);
    if (success) {
      loadServices();
    }
  };

  const generateReport = async () => {
    const monthServices = getServicesByMonth(services, selectedMonth);
    const totalValue = calculateTotalValue(monthServices);
    
    let reportContent = `Relatório de Serviços - ${months[selectedMonth]?.label}\n\n`;
    reportContent += `Total de Serviços: ${monthServices.length}\n`;
    reportContent += `Valor Total: R$ ${totalValue.toFixed(2)}\n\n`;
    reportContent += 'Detalhes dos Serviços:\n\n';

    monthServices.forEach((service, index) => {
      reportContent += `Serviço ${index + 1}:\n`;
      reportContent += `Chassi: ${service.chassi}\n`;
      reportContent += `Placa: ${service.placa}\n`;
      reportContent += `Ordem: ${service.ordem}\n`;
      reportContent += `Valor: R$ ${Number(service.valor).toFixed(2)}\n`;
      reportContent += `Status: ${service.status}\n\n`;
    });

    const filePath = `${RNFS.DocumentDirectoryPath}/relatorio_${months[selectedMonth]?.label}.txt`;
    
    try {
      await RNFS.writeFile(filePath, reportContent, 'utf8');
      await Share.open({
        url: `file://${filePath}`,
        type: 'text/plain',
        title: `Relatório ${months[selectedMonth]?.label}`
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o relatório');
    }
  };

  const handleDeleteService = async (service) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este serviço?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteService(service.data);
            if (success) {
              const updatedServices = await getServices();
              setServices(updatedServices);
            }
          }
        }
      ]
    );
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceText}>Chassi: {item.chassi}</Text>
        <Text style={styles.serviceText}>Placa: {item.placa}</Text>
        <Text style={styles.serviceText}>Ordem: {item.ordem}</Text>
        <Text style={styles.serviceText}>Valor: R$ {Number(item.valor).toFixed(2)}</Text>
        <Text style={styles.serviceText}>Status: {item.status}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditService', { service: item })}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteService(item)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredServices = getServicesByMonth(services, selectedMonth);
  const totalValue = calculateTotalValue(filteredServices);

  const handleMonthButtonPress = () => {
    setShowMonthPicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Título "Serviços Registrados" removido */}
      </View>

      <View style={styles.summaryReportContainer}>
        <View style={styles.summaryHeader}>
           <Text style={styles.cardTitle}>Serviços Registrados</Text>
           <TouchableOpacity
             style={styles.monthButton}
             onPress={handleMonthButtonPress}
           >
             <Text style={styles.monthButtonText}>
               {months[selectedMonth]?.label} de {new Date().getFullYear()}
             </Text>
           </TouchableOpacity>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalValue}>
            Total do Mês: <Text style={styles.totalValueAmount}>R$ {totalValue.toFixed(2)}</Text>
          </Text>
          <Text style={styles.serviceCount}>Serviços: {filteredServices.length}</Text>
        </View>

        <TouchableOpacity
          style={styles.reportButton}
          onPress={generateReport}
        >
          <Text style={styles.reportButtonText}>Exportar para TXT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.serviceListContainer}>
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
        />
      </View>

      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowMonthPicker(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Mês</Text>
            <ScrollView>
              {months.map((month) => (
                <TouchableOpacity
                  key={month.value}
                  style={[
                    styles.monthOption,
                    selectedMonth === month.value && styles.selectedMonth,
                  ]}
                  onPress={() => {
                    setSelectedMonth(month.value);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      selectedMonth === month.value && styles.selectedMonthText,
                    ]}
                  >
                    {month.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowMonthPicker(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.addButtonFixed}
        onPress={() => navigation.navigate('AddService')}
      >
        <Text style={styles.addButtonTextFixed}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryReportContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalValue: {
    fontSize: 18,
    color: '#333',
  },
  totalValueAmount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  serviceCount: {
    fontSize: 16,
    color: '#555',
  },
  monthButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  monthButtonText: {
    fontSize: 16,
    color: '#333',
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceListContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 20,
  },
  list: {
    // flexGrow: 1,
  },
  listContentContainer: {
    paddingBottom: 10,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    borderWidth: 1,
    borderColor: '#eee',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  serviceText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  editButton: {
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  monthOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedMonth: {
    backgroundColor: '#007BFF',
  },
  monthOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMonthText: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButtonFixed: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  addButtonTextFixed: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});