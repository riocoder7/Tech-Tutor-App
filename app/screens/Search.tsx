import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { db, auth } from "@/config/firebaseConfig"; // Import Firestore and Auth
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Colors from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";

const Index: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState<any[]>([]);

  const categories = ["All", "Coding", "Development", "Database", "New Tech"];

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesList: any[] = [];
      querySnapshot.forEach((doc) => {
        coursesList.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesList);
    };

    fetchCourses();
  }, []);

  // Filter courses based on search and category selection
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = searchQuery
      ? course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesCategory =
      searchQuery.length > 0 ||
      selectedCategory === "All" ||
      course.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Function to handle course press and navigation
  const handleCoursePress = async (item: any) => {
    const user = auth.currentUser;

    if (!user) return;

    // Check if the user is enrolled in the course
    const courseRef = doc(db, `users/${user.uid}/enrolledCourses`, item.courseTitle);
    const docSnap = await getDoc(courseRef);

    if (docSnap.exists()) {
      router.replace({
        pathname: "/courseView/courseDetail", // Redirect to Course Detail Screen
        params: {
          courseParams: JSON.stringify(item),
        },
      });
    } else {
      router.replace({
        pathname: "../courseView", // Redirect to Course View Screen
        params: {
          courseParams: JSON.stringify(item),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.arrow}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/Home')}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={{ marginLeft: 5, fontSize: 24, fontFamily: "outfit" }}>
            Search
          </Text>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Scrollable Category Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Course Grid List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        numColumns={2} // Display in a grid of 2 columns
        columnWrapperStyle={styles.row} // Style for grid rows
        contentContainerStyle={{ paddingTop: 150, paddingHorizontal: 10 }} // Avoid overlapping with header
        ListEmptyComponent={() => (
          <View>
            <Entypo
              style={styles.noResultsIcon}
              name="open-book"
              size={60}
              color="gray"
            />
            <Text style={styles.noResults}>No courses found.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseItem}
            onPress={() => handleCoursePress(item)}
          >
            <Image
              source={require("@/assets/images/javascript_icon.webp")}
              style={styles.courseImage}
            />
            <Text style={styles.courseTitle}>
              {item.courseTitle || "No Title Available"}
            </Text>
            <View style={{ flexDirection: "row", marginLeft: 7, marginBottom: 7 }}>
              <Ionicons name="book-outline" size={20} color={Colors.primary} />
              <Text style={styles.courseChapters}>
                {item.noOfChapter
                  ? `${item.noOfChapter} Chapters`
                  : "No Chapters Available"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "white",
    zIndex: 10,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: "outfit",
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 15,
    backgroundColor: Colors.bgColor,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#dbffff",
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: Colors.primary,
  },
  selectedCategoryText: {
    color: "white",
    fontFamily: "outfit-bold",
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.black,
    fontFamily: "outfit-bold",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
  courseItem: {
    backgroundColor: "#dbffff",
    borderRadius: 8,
    // marginVertical:20,
    marginLeft:10,
    marginHorizontal: 10,
    marginTop: 30,
    width: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Shadow at the bottom
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // ✅ Shadow for Android
    elevation: 5,
  },
  courseImage: {
    width: "100%",
    height: 100,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    marginBottom: 5,
  },
  courseTitle: {
    fontSize: 16,
    fontFamily: "outfit-bold",
    marginLeft: 5,
  },
  courseChapters: {
    fontSize: 14,
    fontFamily: "outfit",
    color: Colors.primary,
    marginLeft: 5,
  },
  noResults: {
    fontFamily: "outfit-bold",
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  noResultsIcon: {
    textAlign: "center",
    marginTop: 100,
    marginBottom: 10,
  },
  arrow: {
    flexDirection: "row",
    marginBottom: 10,
  },
});

export default Index;
