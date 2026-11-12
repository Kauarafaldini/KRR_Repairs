import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { updateService } from '../utils/storage';

const statusOptions = [
  { label: 'Lançado', value: 'Lançado' },
  { label: 'Não Lançado', value: 'Não Lançado' },
];

export default function EditService({ route, navigation }) {
  const { service } = route.params;
  const [chassi, setChassi] = useState(service.chassi || '');
  const [placa, setPlaca] = useState(service.placa || '');
  const [ordem, setOrdem] = useState(service.ordem || '');
  const [valor, setValor] = useState(service.valor ? service.valor.toString() : '');
  const [status, setStatus] = useState(service.status || 'Não Lançado');
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const handleSave = async () => {
    if (!chassi || !placa || !ordem || !valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const updatedService = {
      ...service,
      chassi,
      placa,
      ordem,
      valor: Number(valor) || 0,
      status,
    };

    const success = await updateService(updatedService);
    if (success) {
      Alert.alert('Sucesso', 'Serviço atualizado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      Alert.alert('Erro', 'Não foi possível atualizar o serviço');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Chassi</Text>
          <TextInput
            style={styles.input}
            value={chassi}
            onChangeText={setChassi}
            placeholder="Digite o chassi"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            value={placa}
            onChangeText={setPlaca}
            placeholder="Digite a placa"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Ordem</Text>
          <TextInput
            style={styles.input}
            value={ordem}
            onChangeText={setOrdem}
            placeholder="Digite a ordem"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Valor</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="Digite o valor"
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Status</Text>
          <TouchableOpacity
            style={styles.statusButton}
            onPress={() => setShowStatusPicker(true)}
          >
            <Text style={styles.statusButtonText}>{status}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showStatusPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Status</Text>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusOption,
                  status === option.value && styles.selectedStatus,
                ]}
                onPress={() => {
                  setStatus(option.value);
                  setShowStatusPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === option.value && styles.selectedStatusText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStatusPicker(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#f4511e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
    width: '80%%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedStatus: {
    backgroundColor: '#f4511e',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedStatusText: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#f4511e',
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
});