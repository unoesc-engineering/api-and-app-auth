import React, { useState } from 'react';
import { ActivityIndicator, Modal, SafeAreaView as OriginalSafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import useApi from '../../hooks/api';
import useAuth from '../../hooks/auth';
import handleError from '../../utils/handleError';

const SafeArea = styled(OriginalSafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 30px;
`
const Wrapper = styled.View`
  position: relative;
  margin: 15px;
  border-radius: 14px;
  background-color: #fff;
  box-shadow: 2px 0 30px rgba(150,150,150,0.3);
  elevation: 1;
`

const Form = styled.View`
  padding: 20px;
`

const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
`

const Buttons = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  padding: 5px;
`
const Button = styled.TouchableOpacity`
  padding: 15px 15px 15px 15px;
`
const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  text-align: right;
`

const Field = styled.TextInput`
  font-size: 16px;
  padding: 14px;
  margin-top: 10px;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 14px;
`

export default function UserAuthModal({ isVisible, onClose, ...props }) {
  const [, setAuth] = useAuth()
  const api = useApi()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = () => {
    setIsLoading(true)
    api.post('/users/auth', {
      email,
      password,
    })
      .then(result => setAuth(result.data))
      .then(() => {
        onClose()
        setEmail('')
        setPassword('')
      })
      .catch(handleError)
      .finally(() => setIsLoading(false))
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeArea>
        <Wrapper {...props}>
          <Form>
            <Field placeholder='E-mail' value={email} onChangeText={setEmail} keyboardType='email-address' autoCompleteType='email' autoCapitalize='none' />
            <Field placeholder='Senha' value={password} onChangeText={setPassword} returnKeyType='go' onSubmitEditing={handleSubmit} secureTextEntry autoCompleteType='password' />

          </Form>

          {isLoading ? <ActivityIndicator size='small' /> : null}

          <Buttons>
            <Button onPress={onClose}>
              <ButtonText style={{ color: '#e67e22' }}>CANCELAR</ButtonText>
            </Button>

            <Button onPress={handleSubmit}>
              <ButtonText style={{ color: '#2980b9' }}>ACESSAR</ButtonText>
            </Button>
          </Buttons>
        </Wrapper>
      </SafeArea>
    </Modal>
  )
}
