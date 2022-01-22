import React from 'react';
import {PureComponent} from 'react';
import {FlatList, Image, View} from 'react-native';

const ItemSeparatorComponent = () => {
  return <View style={StyleConfig.ItemSeparatorComponent} />;
};

export default class HorizontalItems extends PureComponent {
  tileStyleCache = {
    120: {
      height: this.props.dimensions ?? 120,
      width: this.props.dimensions ?? 120,
      aspectRatio: 1,
      backgroundColor: 'blue',
      borderWidth: 1,
    },
  };

  horizontalItem = ({item, index}) => {
    return (
      <View style={this.tileStyleCache[this.props.dimensions]}>
        <Image
          source={{uri: item?.url || item?.['image-url']}}
          style={{width: '100%', height: '100%'}}
        />
      </View>
    );
  };

  render() {
    if (!this.tileStyleCache[this.props.dimensions]) {
      this.tileStyleCache[this.props.dimensions] = {
        ...this.tileStyleCache['120'],
        width: this.props.dimensions,
        width: this.props.dimensions,
      };
    }
    return (
      <FlatList
        data={this.props.data}
        horizontal={true}
        renderItem={this.horizontalItem}
        contentContainerStyle={StyleConfig.contentContainerStyle}
        ItemSeparatorComponent={ItemSeparatorComponent}
        extraData__dimensions={this.props.dimensions}
      />
    );
  }
}

const StyleConfig = {
  contentContainerStyle: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(130, 35, 20, 0.8)',
  },
  ItemSeparatorComponent: {width: 10},
};
