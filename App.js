/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import DummyData from './data';
import FastList from 'dcd-fast-list';

const gapWidth = 10;
const calculateMaxColumns = width => {
  const ranges = [135, 145, 155];
  const possibleColumns = [];
  ranges.forEach((range, index) => {
    const columnsNoGap = Math.floor(width / range);
    const columnsWithGap = Math.floor(
      (width - (columnsNoGap - 1) * gapWidth) / range,
    );
    possibleColumns.push(columnsWithGap);
  });
  return Math.max(...possibleColumns);
};

class SectionHeader extends React.PureComponent {
  viewAll = () => {
    this.props.viewAll(this.props.id, this.props.index);
  };

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text>{this.props.sectionTitle}</Text>
        <TouchableOpacity onPress={this.viewAll} />
      </View>
    );
  }
}

/*
{
 type: 'section_header',
 id: string;
 index: number;
 isShowingAll: boolean;
}
{
 type: 'items__textOnly',
 data: [],
}
{
 type: 'items__hasImage',
 data: [],
}
{
 type: 'items__horizontal',
 data: [],
}
/////////////////////////
By Category
{
 id: string;
 title: string;
 originalData: any[]; /// For `items__horizontal`
 segmented: {
  `${portrait|landscape}_${columns}`: any[]; /// For `items__textOnly` and `items__hasImage`
 }
}
 */

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    paddingHorizontal: 20,
    flex: 1,
  };

  const [data, setData] = React.useState([]);

  const areaOnLayout = e => {
    const layout = e.nativeEvent.layout;
    console.log('Wazzuuup', layout);
    const bestMaxColumns = calculateMaxColumns(layout.width);

    let finalData = [];
    for (let i = 0; i < 3; i++) {
      finalData.push([]);
      for (let j = 0; j < bestMaxColumns; j++) {
        finalData[i].push({});
      }
    }
    setData(finalData);
  };

  console.log('??? final Data', data);

  return (
    <View style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View
        style={{width: '100%', flex: 1, backgroundColor: 'green'}}
        onLayout={areaOnLayout}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1, backgroundColor: 'pink'}}>
          {data.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'yellow',
                  marginBottom: 20,
                }}
                key={`${index}`}>
                {item.map((item2, index2) => {
                  return (
                    <React.Fragment key={`${index}__${index2}`}>
                      <View
                        style={{
                          aspectRatio: 1,
                          flex: 1,
                          backgroundColor: 'red',
                        }}
                      />
                      {index2 !== item.length - 1 ? (
                        <View style={{width: 10, backgroundColor: 'black'}} />
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
