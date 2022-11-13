import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import axios from 'axios'

const AVATAR_SIZE = 68

type UserType = {
  first_name: string
  last_name: string
  uid: string
  avatar: string
  email: string
  phone_number: string
}

export default () => {
  const [flavorsData, setFlavorsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
          'https://random-data-api.com/api/v2/users?size=10',
        )
        // @ts-ignore
        setFlavorsData(response.data)
      } catch (e) {
        setHasError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderItem = ({
    item: {first_name, last_name, uid, avatar, email, phone_number},
  }: ListRenderItemInfo<UserType>) => {
    return (
      <View
        key={uid}
        style={styles.userContainer}
        accessibilityLabel={`${uid}-user-container`}
      >
        <View style={styles.avatarWrapper}>
          <Image source={{uri: avatar}} style={styles.image} />
        </View>
        <View style={styles.userInfoContainer}>
          <Text>
            {first_name} {last_name}
          </Text>
          <Text>{email}</Text>
          <Text>{phone_number}</Text>
        </View>
      </View>
    )
  }

  return (
    <View>
      <Text style={styles.titleText}>The Funky Users DB</Text>
      {loading && (
        <ActivityIndicator
          color={'#000'}
          size={'large'}
          accessibilityLabel={'loader'}
        />
      )}
      {hasError && (
        <View style={styles.errorContainer} accessibilityLabel={'alert'}>
          <Text>Error oopsie!</Text>
        </View>
      )}
      <FlatList<UserType>
        data={flavorsData}
        renderItem={renderItem}
        keyExtractor={item => item.uid}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    flex: 1,
  },
  titleText: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  errorContainer: {backgroundColor: '#C63939', padding: 16, borderRadius: 6},
  userContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    flex: 1,
  },
  avatarWrapper: {
    backgroundColor: 'rgba(88,186,224,0.65)',
    padding: 16,
    borderRadius: AVATAR_SIZE,
  },
  userInfoContainer: {flex: 1, marginLeft: 16},
  image: {height: AVATAR_SIZE, width: AVATAR_SIZE},
})
