import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@toddler_growth_history';

// ===================== WHO LMS DATA (0-24 months) =====================
const LMS = {
  boy: {
    weight: {
      0: { L: 0.3487, M: 3.3464, S: 0.14602 },
      1: { L: 0.2297, M: 4.4709, S: 0.13395 },
      2: { L: 0.197, M: 5.5675, S: 0.12385 },
      3: { L: 0.1738, M: 6.3762, S: 0.11727 },
      4: { L: 0.1553, M: 7.0023, S: 0.11316 },
      5: { L: 0.1395, M: 7.5105, S: 0.1108 },
      6: { L: 0.1257, M: 7.934, S: 0.10958 },
      7: { L: 0.1134, M: 8.297, S: 0.10902 },
      8: { L: 0.1021, M: 8.6151, S: 0.10882 },
      9: { L: 0.0917, M: 8.9014, S: 0.10881 },
      10: { L: 0.082, M: 9.1649, S: 0.10891 },
      11: { L: 0.073, M: 9.4122, S: 0.10906 },
      12: { L: 0.0644, M: 9.6479, S: 0.10925 },
      13: { L: 0.0563, M: 9.8749, S: 0.10949 },
      14: { L: 0.0487, M: 10.0953, S: 0.10976 },
      15: { L: 0.0413, M: 10.3108, S: 0.11007 },
      16: { L: 0.0343, M: 10.5228, S: 0.11041 },
      17: { L: 0.0275, M: 10.7319, S: 0.11079 },
      18: { L: 0.0211, M: 10.9385, S: 0.11119 },
      19: { L: 0.0148, M: 11.143, S: 0.11164 },
      20: { L: 0.0087, M: 11.3462, S: 0.11211 },
      21: { L: 0.0029, M: 11.5486, S: 0.11261 },
      22: { L: -0.0028, M: 11.7504, S: 0.11314 },
      23: { L: -0.0083, M: 11.9514, S: 0.11369 },
      24: { L: -0.0137, M: 12.1515, S: 0.11426 },
    },
    height: {
      0: { L: 1, M: 49.8842, S: 0.03795 },
      1: { L: 1, M: 54.7244, S: 0.03557 },
      2: { L: 1, M: 58.4249, S: 0.03424 },
      3: { L: 1, M: 61.4292, S: 0.03328 },
      4: { L: 1, M: 63.886, S: 0.03257 },
      5: { L: 1, M: 65.9026, S: 0.03204 },
      6: { L: 1, M: 67.6236, S: 0.03165 },
      7: { L: 1, M: 69.1645, S: 0.03139 },
      8: { L: 1, M: 70.5994, S: 0.03124 },
      9: { L: 1, M: 71.9687, S: 0.03117 },
      10: { L: 1, M: 73.2812, S: 0.03118 },
      11: { L: 1, M: 74.5388, S: 0.03125 },
      12: { L: 1, M: 75.7488, S: 0.03137 },
      13: { L: 1, M: 76.9186, S: 0.03154 },
      14: { L: 1, M: 78.0497, S: 0.03174 },
      15: { L: 1, M: 79.1458, S: 0.03197 },
      16: { L: 1, M: 80.2113, S: 0.03222 },
      17: { L: 1, M: 81.2487, S: 0.0325 },
      18: { L: 1, M: 82.2587, S: 0.03279 },
      19: { L: 1, M: 83.2418, S: 0.0331 },
      20: { L: 1, M: 84.1996, S: 0.03342 },
      21: { L: 1, M: 85.1348, S: 0.03376 },
      22: { L: 1, M: 86.0477, S: 0.0341 },
      23: { L: 1, M: 86.941, S: 0.03445 },
      24: { L: 1, M: 87.8161, S: 0.03479 },
    },
  },
  girl: {
    weight: {
      0: { L: 0.3809, M: 3.2322, S: 0.14171 },
      1: { L: 0.1714, M: 4.1873, S: 0.13724 },
      2: { L: 0.0962, M: 5.1282, S: 0.13 },
      3: { L: 0.0402, M: 5.8458, S: 0.12619 },
      4: { L: -0.005, M: 6.4237, S: 0.12402 },
      5: { L: -0.043, M: 6.8985, S: 0.12274 },
      6: { L: -0.0756, M: 7.297, S: 0.12204 },
      7: { L: -0.1039, M: 7.6422, S: 0.12178 },
      8: { L: -0.1288, M: 7.9487, S: 0.12181 },
      9: { L: -0.1507, M: 8.2254, S: 0.12199 },
      10: { L: -0.17, M: 8.48, S: 0.12223 },
      11: { L: -0.1872, M: 8.7192, S: 0.12247 },
      12: { L: -0.2024, M: 8.9481, S: 0.12268 },
      13: { L: -0.2158, M: 9.1699, S: 0.12283 },
      14: { L: -0.2278, M: 9.387, S: 0.12294 },
      15: { L: -0.2384, M: 9.6008, S: 0.12299 },
      16: { L: -0.2478, M: 9.8124, S: 0.12303 },
      17: { L: -0.2562, M: 10.0226, S: 0.12306 },
      18: { L: -0.2637, M: 10.2315, S: 0.12309 },
      19: { L: -0.2703, M: 10.4393, S: 0.12315 },
      20: { L: -0.2762, M: 10.6464, S: 0.12323 },
      21: { L: -0.2815, M: 10.8534, S: 0.12335 },
      22: { L: -0.2862, M: 11.0608, S: 0.1235 },
      23: { L: -0.2903, M: 11.2688, S: 0.12369 },
      24: { L: -0.2941, M: 11.4775, S: 0.1239 },
    },
    height: {
      0: { L: 1, M: 49.1477, S: 0.0379 },
      1: { L: 1, M: 53.6872, S: 0.0364 },
      2: { L: 1, M: 57.0673, S: 0.03568 },
      3: { L: 1, M: 59.8029, S: 0.0352 },
      4: { L: 1, M: 62.0899, S: 0.03486 },
      5: { L: 1, M: 64.0301, S: 0.03463 },
      6: { L: 1, M: 65.7311, S: 0.03448 },
      7: { L: 1, M: 67.2873, S: 0.03441 },
      8: { L: 1, M: 68.7498, S: 0.0344 },
      9: { L: 1, M: 70.1435, S: 0.03444 },
      10: { L: 1, M: 71.4818, S: 0.03452 },
      11: { L: 1, M: 72.771, S: 0.03464 },
      12: { L: 1, M: 74.015, S: 0.03479 },
      13: { L: 1, M: 75.2176, S: 0.03496 },
      14: { L: 1, M: 76.3817, S: 0.03514 },
      15: { L: 1, M: 77.5099, S: 0.03534 },
      16: { L: 1, M: 78.6055, S: 0.03555 },
      17: { L: 1, M: 79.671, S: 0.03576 },
      18: { L: 1, M: 80.7079, S: 0.03598 },
      19: { L: 1, M: 81.7182, S: 0.0362 },
      20: { L: 1, M: 82.7036, S: 0.03643 },
      21: { L: 1, M: 83.6654, S: 0.03666 },
      22: { L: 1, M: 84.604, S: 0.03688 },
      23: { L: 1, M: 85.5202, S: 0.03711 },
      24: { L: 1, M: 86.4153, S: 0.03734 },
    },
  },
};

// ===================== HELPERS =====================
function toZScore(value, L, M, S) {
  if (L === 0) return Math.log(value / M) / S;
  return (Math.pow(value / M, L) - 1) / (L * S);
}

function fromZScore(z, L, M, S) {
  if (L === 0) return M * Math.exp(S * z);
  return M * Math.pow(1 + L * S * z, 1 / L);
}

function zToPercentile(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z >= 0 ? (1 - p) * 100 : p * 100;
}

function getStatus(z) {
  if (z < -3) return { text: 'Severely Low', color: '#b91c1c', bg: '#fee2e2' };
  if (z < -2) return { text: 'Low', color: '#b45309', bg: '#fef3c7' };
  if (z > 3) return { text: 'Severely High', color: '#b91c1c', bg: '#fee2e2' };
  if (z > 2) return { text: 'High', color: '#b45309', bg: '#fef3c7' };
  return { text: 'Normal', color: '#047857', bg: '#d1fae5' };
}

// ===================== TRACK SCREEN =====================
function TrackScreen() {
  const [gender, setGender] = useState('boy');
  const [age, setAge] = useState('12');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(null);

  const calculate = async () => {
    const ageNum = parseInt(age, 10);
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(ageNum) || ageNum < 0 || ageNum > 24) {
      Alert.alert('Invalid Age', 'Please enter age between 0 and 24 months');
      return;
    }
    if (isNaN(w) || w <= 0) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight in kg');
      return;
    }
    if (isNaN(h) || h <= 0) {
      Alert.alert('Invalid Height', 'Please enter a valid length/height in cm');
      return;
    }

    const wLMS = LMS[gender].weight[ageNum];
    const hLMS = LMS[gender].height[ageNum];

    const wZ = toZScore(w, wLMS.L, wLMS.M, wLMS.S);
    const hZ = toZScore(h, hLMS.L, hLMS.M, hLMS.S);
    const wPct = zToPercentile(wZ);
    const hPct = zToPercentile(hZ);

    const res = {
      gender,
      age: ageNum,
      weight: w,
      height: h,
      wZ,
      hZ,
      wPct,
      hPct,
      date: new Date().toISOString(),
    };

    setResult(res);

    // Save to history
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const hist = raw ? JSON.parse(raw) : [];
      hist.unshift(res);
      if (hist.length > 50) hist.length = 50;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(hist));
    } catch (e) {
      console.log('Save error', e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <LinearGradient colors={['#0d9488', '#14b8a6']} style={styles.header}>
          <Text style={styles.headerTitle}>🌱 Toddler Growth</Text>
          <Text style={styles.headerSub}>WHO Standards • 0–24 months</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Enter Measurements</Text>

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'boy' && styles.genderActive]}
              onPress={() => setGender('boy')}
            >
              <Text style={[styles.genderText, gender === 'boy' && styles.genderTextActive]}>Boy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, gender === 'girl' && styles.genderActive]}
              onPress={() => setGender('girl')}
            >
              <Text style={[styles.genderText, gender === 'girl' && styles.genderTextActive]}>Girl</Text>
            </TouchableOpacity>
          </View>

          {/* Age */}
          <Text style={styles.label}>Age (months)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
            placeholder="0 – 24"
            placeholderTextColor="#94a3b8"
          />

          {/* Weight */}
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            placeholder="e.g. 9.5"
            placeholderTextColor="#94a3b8"
          />

          {/* Height */}
          <Text style={styles.label}>Length / Height (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            value={height}
            onChangeText={setHeight}
            placeholder="e.g. 75.0"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate Growth Status</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Results</Text>

            <View style={styles.resultRow}>
              <View style={[styles.resultCard, { backgroundColor: '#f0fdfa' }]}>
                <Text style={styles.resultLabel}>Weight-for-Age</Text>
                <Text style={styles.resultValue}>{result.weight.toFixed(2)} kg</Text>
                <Text style={styles.resultMeta}>
                  Z: {result.wZ.toFixed(2)}  •  {result.wPct.toFixed(0)}th %ile
                </Text>
                <View style={[styles.pill, { backgroundColor: getStatus(result.wZ).bg }]}>
                  <Text style={[styles.pillText, { color: getStatus(result.wZ).color }]}>
                    {getStatus(result.wZ).text}
                  </Text>
                </View>
              </View>

              <View style={[styles.resultCard, { backgroundColor: '#eff6ff' }]}>
                <Text style={styles.resultLabel}>Height-for-Age</Text>
                <Text style={styles.resultValue}>{result.height.toFixed(1)} cm</Text>
                <Text style={styles.resultMeta}>
                  Z: {result.hZ.toFixed(2)}  •  {result.hPct.toFixed(0)}th %ile
                </Text>
                <View style={[styles.pill, { backgroundColor: getStatus(result.hZ).bg }]}>
                  <Text style={[styles.pillText, { color: getStatus(result.hZ).color }]}>
                    {getStatus(result.hZ).text}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Z-score between −2 and +2 is normal.{'\n'}
                Below −2 = low  |  Above +2 = high
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ===================== CHARTS SCREEN =====================
function ChartsScreen() {
  const [gender, setGender] = useState('boy');
  const [age, setAge] = useState(12);
  const [weight, setWeight] = useState(9.6);
  const [height, setHeight] = useState(75.7);

  const ages = Array.from({ length: 25 }, (_, i) => i);

  const buildSeries = (type) => {
    const p3 = [], p50 = [], p97 = [];
    ages.forEach((m) => {
      const lms = LMS[gender][type][m];
      p3.push(fromZScore(-1.88, lms.L, lms.M, lms.S));
      p50.push(lms.M);
      p97.push(fromZScore(1.88, lms.L, lms.M, lms.S));
    });
    return { p3, p50, p97 };
  };

  const wSeries = buildSeries('weight');
  const hSeries = buildSeries('height');

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
    labelColor: () => '#64748b',
    propsForDots: { r: '0' },
    propsForBackgroundLines: { stroke: '#e2e8f0' },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Growth Charts (WHO)</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.genderBtn, gender === 'boy' && styles.genderActive]}
            onPress={() => setGender('boy')}
          >
            <Text style={[styles.genderText, gender === 'boy' && styles.genderTextActive]}>Boy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderBtn, gender === 'girl' && styles.genderActive]}
            onPress={() => setGender('girl')}
          >
            <Text style={[styles.genderText, gender === 'girl' && styles.genderTextActive]}>Girl</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.chartTitle}>Weight-for-Age (kg)</Text>
        <LineChart
          data={{
            labels: ['0', '6', '12', '18', '24'],
            datasets: [
              { data: wSeries.p3, color: () => '#f87171', strokeWidth: 1.5 },
              { data: wSeries.p50, color: () => '#0d9488', strokeWidth: 2.5 },
              { data: wSeries.p97, color: () => '#f87171', strokeWidth: 1.5 },
            ],
            legend: ['3rd', '50th', '97th'],
          }}
          width={width - 48}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines
          withOuterLines={false}
          fromZero={false}
        />

        <Text style={styles.chartTitle}>Length/Height-for-Age (cm)</Text>
        <LineChart
          data={{
            labels: ['0', '6', '12', '18', '24'],
            datasets: [
              { data: hSeries.p3, color: () => '#f87171', strokeWidth: 1.5 },
              { data: hSeries.p50, color: () => '#3b82f6', strokeWidth: 2.5 },
              { data: hSeries.p97, color: () => '#f87171', strokeWidth: 1.5 },
            ],
            legend: ['3rd', '50th', '97th'],
          }}
          width={width - 48}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          }}
          bezier
          style={styles.chart}
          withInnerLines
          withOuterLines={false}
          fromZero={false}
        />
      </View>
    </ScrollView>
  );
}

// ===================== HISTORY SCREEN =====================
function HistoryScreen() {
  const [history, setHistory] = useState([]);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const clearAll = () => {
    Alert.alert('Clear History', 'Delete all measurements?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem(STORAGE_KEY);
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { flex: 1, marginBottom: 0 }]}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          {history.length > 0 && (
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No measurements yet.{'\n'}Go to Track tab and calculate.</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.histItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.histDate}>
                    {new Date(item.date).toLocaleDateString()} • {item.age} mo • {item.gender}
                  </Text>
                  <Text style={styles.histValues}>
                    {item.weight.toFixed(2)} kg  |  {item.height.toFixed(1)} cm
                  </Text>
                  <Text style={styles.histZ}>
                    W Z: {item.wZ.toFixed(2)} ({item.wPct.toFixed(0)}%)  •  H Z: {item.hZ.toFixed(2)} ({item.hPct.toFixed(0)}%)
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

// ===================== NAVIGATION =====================
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0d9488',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e2e8f0',
          paddingBottom: 6,
          height: 60,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{ tabBarLabel: 'Track', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📏</Text> }}
      />
      <Tab.Screen
        name="Charts"
        component={ChartsScreen}
        options={{ tabBarLabel: 'Charts', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📈</Text> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarLabel: 'History', tabBarIcon: () => <Text style={{ fontSize: 20 }}>📜</Text> }}
      />
    </Tab.Navigator>
  );
}

// ===================== APP =====================
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0d9488' }} edges={['top']}>
          <MainTabs />
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdfa',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 14,
    color: '#ccfbf1',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f766e',
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  genderActive: {
    backgroundColor: '#0d9488',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  genderTextActive: {
    color: '#fff',
  },
  calcBtn: {
    backgroundColor: '#0d9488',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  calcBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultRow: {
    flexDirection: 'row',
    gap: 10,
  },
  resultCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginVertical: 4,
  },
  resultMeta: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  pill: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noteBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  noteText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  clearText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 22,
  },
  histItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  histDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f766e',
  },
  histValues: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
  },
  histZ: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});