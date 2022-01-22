/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Dimensions,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import DummyData from './data';

// Helpers
import calculateHorizontalTileWidth from './src/helpers/calculateHorizontalTileWidth';
import calculateMaxColumns from './src/helpers/calculateMaxColumns';

// Reducers
import tileWidthReducer from './src/reducers/tileWidthReducer';

/// Rows
import Row__HorizontalItems from './src/components/rows/HorizontalItems';
import Row__SectionHeader from './src/components/rows/SectionHeader';

const RowTypes = {
  section_header: 'section_header',
  items__textOnly: 'items__textOnly',
  items__hasImage: 'items__hasImage',
  items__horizontal: 'items__horizontal',
};

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
[id]: {
 id: string;
 title: string;
 originalData: any[]; /// For `items__horizontal`
 segments: {
  `${portrait|landscape}_${columns}`: any[]; /// For `items__textOnly` and `items__hasImage`
 }
}
 */

class HasImage extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'yellow',
          marginBottom: 10,
        }}>
        {this.props.data?.map((item, index) => {
          return (
            <React.Fragment key={`hasImage_${index}`}>
              <View
                style={{
                  flex: 1 / this.props.maxColumns,
                  aspectRatio: 1,
                  borderWidth: 1,
                  backgroundColor: 'cyan',
                }}>
                <Image
                  source={{uri: item?.url || item?.['image-url']}}
                  style={{width: '100%', height: '100%'}}
                />
                <Text>{item.description || item.title}</Text>
              </View>
              {index !== this.props.data?.length - 1 ? (
                <View style={{width: 10}} />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    );
  }
}

class TextOnly extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'brown',
          marginBottom: 10,
          borderRadius: 20,
        }}>
        {this.props.data?.map((item, index) => {
          return (
            <React.Fragment key={`hasImage_${index}`}>
              <View
                style={{
                  flex: 1 / (this.props.maxColumns - 1),
                  borderWidth: 1,
                  backgroundColor: 'violet',
                }}>
                <Text>{item.description || item.title}</Text>
              </View>
              {index !== this.props.data?.length - 1 ? (
                <View style={{width: 10}} />
              ) : null}
            </React.Fragment>
          );
        })}
      </View>
    );
  }
}

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dataDetails, setDataDetails] = React.useState({});
  const [finalD, setFinalD] = React.useState([]);
  const [currentExpanded, setCurrentExpanded] = React.useState(null);
  const [maxColumns, setMaxColumns] = React.useState(null);
  const [currentLayoutWidth, setCurrentLayoutWidth] = React.useState(
    Dimensions.get('window').width,
  );
  const [tileWidthsState, tileWidthDispatch] = React.useReducer(
    tileWidthReducer,
    {},
  );

  const viewAll = React.useCallback(
    (id, index) => {
      if (currentExpanded === id) {
        setCurrentExpanded(null);
      } else {
        setCurrentExpanded(id);
      }
    },
    [currentExpanded],
  );

  const areaOnLayout = React.useCallback(e => {
    const width = e.nativeEvent.layout?.width;
    setCurrentLayoutWidth(width);

    ////// Horizontal Tiles Width Calculation
    const tileWidth = calculateHorizontalTileWidth(width - 20);
    tileWidthDispatch({
      type: 'addTileWidth',
      width,
      tileWidth,
    });

    ///// View All Column Calculation
    const bestMaxColumns = calculateMaxColumns(width);
    setMaxColumns(bestMaxColumns);
  }, []);

  const renderItem = React.useCallback(
    itemData => {
      const {index, item} = itemData;
      switch (item.type) {
        case RowTypes.section_header: {
          return (
            <Row__SectionHeader
              sectionTitle={item.sectionTitle}
              id={item.id}
              index={index}
              viewAll={viewAll}
            />
          );
        }
        case RowTypes.items__horizontal: {
          return (
            <Row__HorizontalItems
              data={item.data}
              dimensions={tileWidthsState[currentLayoutWidth]}
            />
          );
        }
        case RowTypes.items__hasImage: {
          return <HasImage data={item.data} maxColumns={maxColumns} />;
        }
        case RowTypes.items__textOnly: {
          return <TextOnly data={item.data} maxColumns={maxColumns} />;
        }
        default: {
          break;
        }
      }
      return null;
    },
    [viewAll, maxColumns, tileWidthsState, currentLayoutWidth],
  );

  useEffect(() => {
    const dataDetails = {};
    const order = [];

    if (!maxColumns) {
      return;
    }

    DummyData.forEach((category, index) => {
      dataDetails[category.id] = {
        id: category.id,
        title: category.title,
        originalData: category.data,
      };
      order.push(category.id);
    });

    setDataDetails(dataDetails);

    const finalD__1 = [];

    for (let i = 0; i < order.length; i++) {
      const currentCategoryID = order[i];
      const currentDetails = dataDetails[currentCategoryID];

      const isShowingAll = currentExpanded === currentCategoryID;

      /// Section Header
      finalD__1.push({
        type: RowTypes.section_header,
        id: currentCategoryID,
        sectionTitle: currentDetails.title,
        isShowingAll,
      });

      if (isShowingAll) {
        for (let j = 0; j < currentDetails.originalData?.length; j++) {
          const rowItem = [];
          let type = RowTypes.items__textOnly;

          for (let k = 0; k < maxColumns; k++) {
            const currItem = currentDetails.originalData[j + k];

            if (currItem?.url || currItem?.['image-url']) {
              type = RowTypes.items__hasImage;
            }

            rowItem.push(currItem || 'spacer');

            if (k === maxColumns - 1) {
              if (type === RowTypes.items__textOnly) {
                rowItem.pop();
                j = j + k - 1;
              } else {
                j = j + k;
              }
            }
          }

          finalD__1.push({
            type,
            data: rowItem,
          });
        }
      } else {
        finalD__1.push({
          type: RowTypes.items__horizontal,
          data: currentDetails.originalData,
        });
      }
    }

    setFinalD(finalD__1);
  }, [currentExpanded, maxColumns]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <View style={backgroundStyle}>
      <Text>Window Width: {Dimensions.get('window').width}</Text>
      <Text>Screen Width: {Dimensions.get('screen').width}</Text>
      <Text>tileWidthsState: {JSON.stringify(tileWidthsState)}</Text>
      <FlatList
        onLayout={areaOnLayout}
        data={finalD}
        renderItem={renderItem}
        contentContainerStyle={FlatList__ContentContainerStyle}
        style={FlatList__Style}
      />
    </View>
  );
};

const FlatList__Style = {width: '100%', flex: 1, backgroundColor: 'red'};

const FlatList__ContentContainerStyle = {
  marginHorizontal: -20,
  paddingHorizontal: 20,
};

/*

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
 */

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
