import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

interface LanguageOption {
  label: string;
  value: string;
}

const languages: LanguageOption[] = [
  { label: 'Python', value: '71' },
  { label: 'C++', value: '54' },
  { label: 'Java', value: '62' },
  { label: 'C', value: '50' },
  { label: 'JavaScript', value: '63' },
  { label: 'Rust', value: '73' },
  { label: 'Ruby', value: '72' },
  { label: 'Go', value: '60' },
  { label: 'PHP', value: '68' }
];

// Default code snippets for each language
const defaultCodeSnippets: Record<string, string> = {
  '71': `# Python Code
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
  '54': `// C++ Code
#include <iostream>
using namespace std;
int main() {
    string name;
    cout << "Enter your name: ";
    cin >> name;
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`,
  '62': `// Java Code
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter your name: ");
        String name = sc.nextLine();
        System.out.println("Hello, " + name + "!");
    }
}`,
  '50': `// C Code
#include <stdio.h>
int main() {
    char name[50];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\\n", name);
    return 0;
}`,
  '63': `// JavaScript Code
function greet(name) {
    return "Hello, " + name + "!";
}
console.log(greet("World"));`,
  '73': `// Rust Code
use std::io;
fn main() {
    let mut name = String::new();
    println!("Enter your name: ");
    io::stdin().read_line(&mut name).expect("Failed to read input");
    println!("Hello, {}!", name.trim());
}`,
  '72': `# Ruby Code
def greet(name)
  return "Hello, #{name}!"
end

puts greet("World")`,
  '60': `// Go Code
package main
import "fmt"
func main() {
    var name string
    fmt.Print("Enter your name: ")
    fmt.Scanln(&name)
    fmt.Println("Hello,", name)
}`,
  '68': `<?php
// PHP Code
function greet($name) {
    return "Hello, " . $name . "!";
}
echo greet("World");
?>`
};

// Function to determine if the code requires user input based on heuristics
const codeRequiresInput = (language: string, code: string): boolean => {
  switch (language) {
    case '71': // Python
      return code.includes("input(");
    case '54': // C++
      return code.includes("cin >>");
    case '62': // Java
      return code.includes("Scanner");
    case '50': // C
      return code.includes("scanf(");
    case '63': // JavaScript
      return code.includes("prompt(");
    case '73': // Rust
      return code.includes("read_line");
    case '72': // Ruby
      return code.includes("gets");
    case '60': // Go
      return code.includes("Scanln");
    case '68': // PHP
      return code.includes("fgets") || code.includes("readline");
    default:
      return false;
  }
};

const CompilerScreen: React.FC = () => {
  const router = useRouter();
  const [userInput, setUserInput] = useState('');
  const [language, setLanguage] = useState(languages[0].value);
  const [code, setCode] = useState(defaultCodeSnippets[languages[0].value]);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine whether to show the input field based on the code content
  const showInputField = codeRequiresInput(language, code);

  const handleLanguageChange = (selectedLanguage: string) => {
    setLanguage(selectedLanguage);
    setCode(defaultCodeSnippets[selectedLanguage]);
    setUserInput(''); // Clear input when language changes
    setOutput(''); // Clear output when language changes
  };

  const handleCompile = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch(
        'https://judge029.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'judge029.p.rapidapi.com',
            'x-rapidapi-key': 'de5e05f3e6mshe002c4fa7cc298dp16d096jsn9b70bf4e91a5' // Replace with your API key
          },
          body: JSON.stringify({
            source_code: code,
            language_id: parseInt(language),
            stdin: showInputField ? userInput : ""
          })
        }
      );
      const data = await response.json();
      setOutput(data.stdout || data.compile_output || data.stderr || 'No output');
    } catch (error) {
      console.error('Error compiling code:', error);
      setOutput('Error compiling code. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color={Colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Compiler</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Bar: Dropdown & Run Button */}
        <View style={styles.topBar}>
          <Picker
            selectedValue={language}
            mode="dropdown"
            onValueChange={handleLanguageChange}
            style={styles.picker}
          >
            {languages.map(lang => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.runButton} onPress={handleCompile} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Run Code</Text>}
          </TouchableOpacity>
        </View>
        {/* Code Editor */}
        <Text style={styles.editorLabel}>Code Editor:</Text>
        <TextInput
          style={styles.codeInput}
          multiline
          value={code}
          onChangeText={setCode}
          autoCorrect={false}
          spellCheck={false}
          autoCapitalize="none"
        />
        {/* Conditionally show User Input Field */}
        {showInputField && (
          <>
            <Text style={styles.label}>Enter Input:</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter your input (one per line)..."
              placeholderTextColor="#999"
              value={userInput}
              onChangeText={setUserInput}
              multiline
              textAlignVertical="top"
            />
          </>
        )}
        {/* Output Section */}
        <View style={styles.outputSection}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>Output:</Text>
            <TouchableOpacity style={styles.clearButton} onPress={() => setOutput('')}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.outputContainer}>
            <ScrollView style={styles.outputScroll}>
              <Text style={styles.output}>{output}</Text>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: { 
    flexGrow: 1, 
    padding: 16, 
    backgroundColor: 'white' 
  },
  header: { 
    flexDirection: 'row', 
    padding: 10, 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 10
  },
  headerText: { 
    paddingLeft: 5, 
    fontFamily: 'outfit-bold', 
    fontSize: 24, 
    color: Colors.black 
  },
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  picker: { 
    width: '60%', 
    backgroundColor: Colors.gray, 
  },
  runButton: { 
    backgroundColor: Colors.primary, 
    padding: 10, 
    borderRadius: 10 
  },
  buttonText: { 
    fontSize: 16,
    color: '#fff', 
    fontFamily: 'outfit-bold' 
  },
  editorLabel: { 
    fontSize: 16, 
    fontFamily: 'outfit-bold', 
    marginBottom: 6 
  },
  codeInput: {
    height: 180,
    backgroundColor: Colors.dgray,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    color: 'white',
    fontFamily: 'monospace'
  },
  label: { 
    fontSize: 16, 
    fontFamily: 'outfit-bold', 
    marginTop: 10, 
    color: 'black'
  },
  inputField: {
    height: 50,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:5,
    fontSize: 16,
    marginTop: 5,
  },
  outputSection: { 
    marginTop: 10 
  },
  outputContainer: {
    marginTop: 10,
    backgroundColor: Colors.gray,
    borderRadius: 10,
    minHeight: 80,
    padding: 12
  },
  outputScroll: { 
    maxHeight: 100 
  },
  output: { 
    fontSize: 16, 
    color: '#333' 
  },
  clearButton: { 
    alignSelf: 'flex-end', 
    marginTop: 8, 
    backgroundColor: Colors.green, 
    padding: 6, 
    borderRadius: 5 
  },
  clearText: { 
    fontSize: 16, 
    fontFamily: 'outfit-bold', 
    color: 'white' 
  }
});

export default CompilerScreen;
