import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface LanguageOption {
  label: string;
  value: string;
}

const languages: LanguageOption[] = [
  { label: 'Python 3', value: '71' },
  { label: 'C++', value: '54' },
  { label: 'Java', value: '62' },
  { label: 'C', value: '50' },
  { label: 'JavaScript', value: '63' },
  { label: 'Ruby', value: '72' },
  { label: 'Go', value: '60' },
  { label: 'PHP', value: '68' },
  // Add more languages as needed following Judge0 language IDs
];

const CompilerScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(languages[0].value); // Default to Python 3
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
            'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY' // Replace with your key
          },
          body: JSON.stringify({
            source_code: code,
            language_id: parseInt(language),
            stdin: ""
          })
        }
      );
      const data: { stdout?: string; compile_output?: string; stderr?: string } = await response.json();
      setOutput(data.stdout || data.compile_output || data.stderr || 'No output');
    } catch (error) {
      console.error('Error compiling code:', error);
      setOutput('Error compiling code. Please check your internet connection.');
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
        placeholderTextColor="#999"
        value={code}
        onChangeText={setCode}
      />

      <Text style={styles.label}>Select Language:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={language}
          onValueChange={(itemValue: string) => setLanguage(itemValue)}
          style={styles.picker}
        >
          {languages.map(lang => (
            <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCompile} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Compile</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Output:</Text>
      <View style={styles.outputContainer}>
        <Text style={styles.output}>{output}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    fontSize: 26, 
    fontWeight: '700', 
    textAlign: 'center', 
    marginBottom: 16, 
    color: '#333' 
  },
  label: { 
    fontSize: 18, 
    marginVertical: 8, 
    color: '#444', 
    fontWeight: '600' 
  },
  codeInput: { 
    height: 150, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    textAlignVertical: 'top', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    elevation: 3 
  },
  pickerContainer: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    elevation: 3 
  },
  picker: { 
    height: 50, 
    width: '100%' 
  },
  button: { 
    backgroundColor: '#007bff', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginVertical: 16, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    elevation: 3 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  outputContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    minHeight: 60,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  output: { 
    fontSize: 16, 
    color: '#333' 
  }
});

export default CompilerScreen;
