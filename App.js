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
import calculateHorizontalTileWidth from './src/helpers/calculateHorizontalTileWidth';

// Reducers
import tileWidthReducer from './src/reducers/tileWidthReducer';

const gapWidth = 10;
const rangesDefault = [135, 145, 155];
const calculateMaxColumns = (width, ranges = rangesDefault) => {
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

const calculateMaxTileWidth2 = (totalScreenWidth, ranges) => {
  const finalWidth = totalScreenWidth - 20; /// 20 is paddingLeft
  return calculateHorizontalTileWidth(finalWidth, ranges);
};

class SectionHeader extends React.PureComponent {
  viewAll = () => {
    this.props.viewAll(this.props.id, this.props.index);
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          minHeight: 50,
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <View style={{flex: 1}}>
          <Text>{this.props.sectionTitle}</Text>
        </View>
        <TouchableOpacity
          onPress={this.viewAll}
          style={{
            borderWidth: 1,
            borderColor: 'black',
            paddingHorizontal: 15,
            alignItems: 'center',
          }}>
          <Text>View All</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

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

const horizontalItem = ({item, index}) => {
  return (
    <View
      style={{
        height: 150,
        aspectRatio: 1,
        backgroundColor: 'blue',
        borderWidth: 1,
      }}>
      <Image
        source={{uri: item?.url || item?.['image-url']}}
        style={{width: '100%', height: '100%'}}
      />
    </View>
  );
};

class HorizontalItems extends React.PureComponent {
  render() {
    return (
      <FlatList
        data={this.props.data}
        horizontal={true}
        renderItem={horizontalItem}
        contentContainerStyle={{
          paddingHorizontal: 20,
          backgroundColor: 'rgba(130, 35, 20, 0.8)',
        }}
        ItemSeparatorComponent={() => {
          return <View style={{width: 10}} />;
        }}
      />
    );
  }
}

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

  const viewAll = (id, index) => {
    if (currentExpanded === id) {
      setCurrentExpanded(null);
    } else {
      setCurrentExpanded(id);
    }
  };

  console.log(
    'Deets',
    JSON.stringify({
      320: calculateMaxTileWidth2(320),
      360: calculateMaxTileWidth2(360),
      375: calculateMaxTileWidth2(375),
      414: calculateMaxTileWidth2(414),
      1024: calculateMaxTileWidth2(1024),
      1112: calculateMaxTileWidth2(1112),
      768: calculateMaxTileWidth2(768),
    }),
  );

  const SectionRenderItem = data => {
    const {index, item} = data;
    switch (item.type) {
      case RowTypes.section_header: {
        return (
          <SectionHeader
            sectionTitle={item.sectionTitle}
            id={item.id}
            index={index}
            viewAll={viewAll}
          />
        );
      }
      case RowTypes.items__horizontal: {
        return <HorizontalItems data={item.data} />;
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
  };

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

  const [data, setData] = React.useState([]);

  const [currentLayoutWidth, setCurrentLayoutWidth] = React.useState(
    Dimensions.get('window').width,
  );
  const [tileWidthsState, dispatch] = React.useReducer(tileWidthReducer, {});

  const areaOnLayout = React.useCallback(e => {
    const width = e.nativeEvent.layout?.width;
    setCurrentLayoutWidth(width);

    ////// Horizontal Tiles Width Calculation
    const tileWidth = calculateHorizontalTileWidth(width - 20);
    dispatch({
      type: 'addTileWidth',
      width,
      tileWidth,
    });

    ///// View All Column Calculation
    const bestMaxColumns = calculateMaxColumns(width);
    let finalData = [];
    for (let i = 0; i < 3; i++) {
      finalData.push([]);
      for (let j = 0; j < bestMaxColumns; j++) {
        finalData[i].push({});
      }
    }
    setData(finalData);
    setMaxColumns(bestMaxColumns);
  }, []);

  return (
    <View style={backgroundStyle}>
      <Text>Window Width: {Dimensions.get('window').width}</Text>
      <Text>Screen Width: {Dimensions.get('screen').width}</Text>
      <Text>tileWidthsState: {JSON.stringify(tileWidthsState)}</Text>
      <FlatList
        onLayout={areaOnLayout}
        data={finalD}
        renderItem={SectionRenderItem}
        contentContainerStyle={FlatList__ContentContainerStyle}
        style={FlatList__Style}
        extraData__currentWidth={currentLayoutWidth}
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
