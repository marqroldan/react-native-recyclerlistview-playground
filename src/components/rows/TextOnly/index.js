import React from 'react';
import {Text, View} from 'react-native';

export default class TextOnly extends React.PureComponent {
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
