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
import Row__TextOnly from './src/components/rows/TextOnly';
import Row__HasImage from './src/components/rows/HasImage';

const RowTypes = {
  section_header: 'section_header',
  items__textOnly: 'items__textOnly',
  items__hasImage: 'items__hasImage',
  items__horizontal: 'items__horizontal',
};

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
          return <Row__HasImage data={item.data} maxColumns={maxColumns} />;
        }
        case RowTypes.items__textOnly: {
          return <Row__TextOnly data={item.data} maxColumns={maxColumns} />;
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

export default App;
