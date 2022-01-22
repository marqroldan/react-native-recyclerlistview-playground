import React from 'react';
import {Image, Text, View} from 'react-native';

export default class HasImage extends React.PureComponent {
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
