import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const StockUI = () => {
  const [holdings, setHoldings] = useState([]);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);
  const [todaysPnl, setTodaysPnl] = useState(0);
  const [currentV, setCurrentV] = useState(0);
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://run.mocky.io/v3/bde7230e-bc91-43bc-901d-c79d008bddc8',
      );
      setHoldings(response.data.userHolding);
      calculateMetrics(response.data.userHolding);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateMetrics = holdings => {
    let totalInvestment = 0;
    let totalPnl = 0;
    let todaysPnl = 0;
    let currentValue = 0;
    let totalCurrentValue = 0;
    let totalCloseValue = 0;
    let totalLtp = 0;
    let totalQuantity = 0;

    holdings.forEach(holding => {
      const ltp = holding.ltp || 0;
      const quantity = holding.quantity || 0;
      let InvestmentValue = holding.avgPrice * quantity;
      currentValue = ltp * quantity;
      totalInvestment += InvestmentValue;
      totalCurrentValue += currentValue;
      totalCloseValue += holding.close;
      totalLtp += holding.ltp;
      totalQuantity += holding.quantity;
    });
    totalPnl += totalCurrentValue - totalInvestment;
    todaysPnl = (totalCloseValue - totalLtp) * totalQuantity;
    setCurrentV(totalCurrentValue.toFixed(2));
    setTotalInvestment(totalInvestment.toFixed(2));
    setTodaysPnl(todaysPnl.toFixed(2));
    setTotalPnl(totalPnl.toFixed(2));
  };

  const HoldingItem = ({symbol, avgPrice, quantity, ltp}) => {
    let IndividualCV = ltp * quantity;
    let InvestmentValue = avgPrice * quantity;
    let pnl = IndividualCV - InvestmentValue;
    return (
      <View style={styles.holdingContainer}>
        <View>
          <Text style={styles.stockName}>{symbol}</Text>
          <Text style={styles.details}>{quantity}</Text>
        </View>
        <View style={styles.holdingSubContainer}>
          <Text style={styles.details}>
            LTP:<Text style={styles.stockName}> ₹ {ltp.toFixed(2)}</Text>
          </Text>
          <Text style={styles.details}>
            P&L:
            <Text style={styles.stockName}>₹ {pnl.toFixed(2)}</Text>
          </Text>
        </View>
      </View>
    );
  };

  const PortfolioData = () => {
    return (
      <>
        <TouchableOpacity  activeOpacity={1} onPress={() => setExpanded(!isExpanded)}>
          <View style={styles.expandView}>
            <Image
              style={styles.iconStyle}
              source={
                isExpanded
                  ? require('./../assets/down-arrow.png')
                  : require('./../assets/up-arrow.png')
              }></Image>
            <View style={styles.portfolioContainer}>
              <View style={styles.summaryContainer}>
                <Text style={styles.stockName}>Profit & Loss:</Text>
                <Text style={styles.details}>₹ {totalPnl}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.portfolioContainer}>
              <View style={styles.summaryContainer}>
                <Text style={styles.stockName}>Current Value:</Text>
                <Text style={styles.details}> ₹ {currentV}</Text>
              </View>
              <View style={styles.summaryContainer}>
                <Text style={styles.stockName}>Total Investment:</Text>
                <Text style={styles.details}>₹ {totalInvestment}</Text>
              </View>
              <View style={styles.summaryContainer}>
                <Text style={styles.stockName}>Today's Profit & Loss:</Text>
                <Text style={styles.details}> ₹ {todaysPnl}</Text>
              </View>
              <View style={styles.summaryContainer}>
                <Text style={styles.stockName}>Profit & Loss:</Text>
                <Text style={styles.details}>₹ {totalPnl}</Text>
              </View>
            </View>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upstox Holding</Text>
      <FlatList
        data={holdings}
        keyExtractor={item => item.symbol}
        renderItem={({item}) => <HoldingItem {...item} />}
      />
      {PortfolioData()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c7c7cb',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: '#800080',
    color: '#fff',
  },
  holdingContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  details: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioContainer: {},
  holdingSubContainer: {
    alignItems: 'flex-end',
  },
  iconStyle: {
    height: 40,
    width: 40,
    tintColor: '#800080',
    alignSelf:"center"
  },
  expandView: {
    backgroundColor: '#fff',
  },
});

export default StockUI;
