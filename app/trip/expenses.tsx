import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';

interface Expense {
  _id: string;
  category: string;
  price: number;
  paidBy: string;
  splitBy: string;
}

export default function TripExpensesScreen() {
  const { tripId } = useLocalSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    price: '',
    paidBy: '',
    splitBy: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/getExpenses/${tripId}`);
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleSetBudget = async () => {
    if (!budget || budget <= 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }

    try {
      await axios.put(`http://localhost:8000/setBudget/${tripId}`, { budget });
      Alert.alert('Success', 'Budget set successfully!');
    } catch (error) {
      console.error('Error setting budget:', error);
      Alert.alert('Error', 'Failed to set budget');
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.price || !newExpense.paidBy || !newExpense.splitBy) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const expenseData = {
        ...newExpense,
        price: parseFloat(newExpense.price),
      };

      await axios.post(`http://localhost:8000/addExpense/${tripId}`, expenseData);
      setNewExpense({ category: '', price: '', paidBy: '', splitBy: '' });
      setShowAddExpense(false);
      fetchExpenses();
      Alert.alert('Success', 'Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.price, 0);
  const remainingBudget = budget - totalExpenses;

  const expenseCategories = [
    '🍽️ Food & Dining',
    '🚗 Transportation',
    '🏨 Accommodation',
    '🎯 Activities',
    '🛍️ Shopping',
    '☕ Coffee & Drinks',
    '🎫 Tickets',
    '💊 Health & Medical',
    '📱 Communication',
    '🎁 Gifts & Souvenirs',
    '🔧 Miscellaneous',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </Pressable>
        <Text style={styles.title}>Trip Expenses</Text>
        <Pressable onPress={() => setShowAddExpense(true)}>
          <AntDesign name="plus" size={24} color="orange" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* Budget Section */}
        <View style={styles.budgetCard}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <View style={styles.budgetRow}>
            <TextInput
              style={styles.budgetInput}
              placeholder="Set budget amount"
              value={budget.toString()}
              onChangeText={(text) => setBudget(parseFloat(text) || 0)}
              keyboardType="numeric"
            />
            <Pressable onPress={handleSetBudget} style={styles.setBudgetButton}>
              <Text style={styles.setBudgetText}>Set</Text>
            </Pressable>
          </View>
          
          {budget > 0 && (
            <View style={styles.budgetSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Budget:</Text>
                <Text style={styles.summaryValue}>₹{budget.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Spent:</Text>
                <Text style={[styles.summaryValue, { color: '#ff4444' }]}>
                  ₹{totalExpenses.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Remaining:</Text>
                <Text style={[
                  styles.summaryValue, 
                  { color: remainingBudget >= 0 ? '#4CAF50' : '#ff4444' }
                ]}>
                  ₹{remainingBudget.toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Expenses List */}
        <View style={styles.expensesSection}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          {expenses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No expenses added yet</Text>
              <Pressable onPress={() => setShowAddExpense(true)} style={styles.addFirstExpenseButton}>
                <Text style={styles.addFirstExpenseText}>Add First Expense</Text>
              </Pressable>
            </View>
          ) : (
            expenses.map((expense, index) => (
              <View key={expense._id || index} style={styles.expenseCard}>
                <View style={styles.expenseHeader}>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  <Text style={styles.expenseAmount}>₹{expense.price.toFixed(2)}</Text>
                </View>
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseDetail}>Paid by: {expense.paidBy}</Text>
                  <Text style={styles.expenseDetail}>Split by: {expense.splitBy}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Expense</Text>
                <Pressable onPress={() => setShowAddExpense(false)}>
                  <AntDesign name="close" size={24} color="black" />
                </Pressable>
              </View>

              <ScrollView style={styles.modalContent}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                  {expenseCategories.map((category, index) => (
                    <Pressable
                      key={index}
                      onPress={() => setNewExpense({ ...newExpense, category })}
                      style={[
                        styles.categoryChip,
                        newExpense.category === category && styles.selectedCategoryChip
                      ]}>
                      <Text style={[
                        styles.categoryChipText,
                        newExpense.category === category && styles.selectedCategoryChipText
                      ]}>
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <Text style={styles.inputLabel}>Amount (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter amount"
                  value={newExpense.price}
                  onChangeText={(text) => setNewExpense({ ...newExpense, price: text })}
                  keyboardType="numeric"
                />

                <Text style={styles.inputLabel}>Paid By</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Who paid for this?"
                  value={newExpense.paidBy}
                  onChangeText={(text) => setNewExpense({ ...newExpense, paidBy: text })}
                />

                <Text style={styles.inputLabel}>Split By</Text>
                <TextInput
                  style={styles.input}
                  placeholder="How to split this expense?"
                  value={newExpense.splitBy}
                  onChangeText={(text) => setNewExpense({ ...newExpense, splitBy: text })}
                />

                <Pressable onPress={handleAddExpense} style={styles.addExpenseButton}>
                  <Text style={styles.addExpenseButtonText}>Add Expense</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  budgetCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  setBudgetButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  setBudgetText: {
    color: 'white',
    fontWeight: 'bold',
  },
  budgetSummary: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expensesSection: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addFirstExpenseButton: {
    backgroundColor: '#4B61D1',
    padding: 15,
    borderRadius: 25,
    paddingHorizontal: 30,
  },
  addFirstExpenseText: {
    color: 'white',
    fontWeight: 'bold',
  },
  expenseCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
  },
  expenseDetails: {
    gap: 4,
  },
  expenseDetail: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoryChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategoryChip: {
    backgroundColor: '#4B61D1',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryChipText: {
    color: 'white',
  },
  addExpenseButton: {
    backgroundColor: '#4B61D1',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  addExpenseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});