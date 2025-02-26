import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Ensure package is installed

const CompilerScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('71'); // Default to Python (Judge0 ID)
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompile = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY' // Replace with actual key
          },
          body: JSON.stringify({
            source_code: code,
            language_id: parseInt(language),
            stdin: ""
          })
        }
      );
      const data = await response.json();
      setOutput(data.stdout || data.compile_output || data.stderr || 'No output');
    } catch (error) {
      console.error('Error compiling code:', error);
      setOutput('Error compiling code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Online Compiler</Text>

      <Text style={styles.label}>Write your code:</Text>
      <TextInput
        style={styles.codeInput}
        multiline
        placeholder="Enter code here..."
        value={code}
        onChangeText={setCode}
      />

      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue: string) => setLanguage(itemValue)} // Type explicitly defined
          style={styles.picker}
        >
          <Picker.Item label="Python 3" value="71" />
          <Picker.Item label="C++" value="54" />
          <Picker.Item label="Java" value="62" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCompile} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Compile</Text>}
      </TouchableOpacity>

      <Text style={styles.label}>Output:</Text>
      <Text style={styles.output}>{output}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 16, color: '#333' },
  label: { fontSize: 16, marginVertical: 8, color: '#555' },
  codeInput: { height: 150, backgroundColor: '#fff', borderRadius: 8, padding: 10, fontSize: 16, textAlignVertical: 'top' },
  pickerContainer: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 16 },
  picker: { height: 50, width: '100%' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  output: { backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 16, color: '#333', minHeight: 50 }
});

export default CompilerScreen;
