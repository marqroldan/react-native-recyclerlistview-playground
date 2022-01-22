import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

export default class SectionHeader extends React.PureComponent {
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
