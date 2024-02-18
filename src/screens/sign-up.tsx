import React, {MutableRefObject, useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DismissKeyboardView from '@/components/layout/dismiss-keyboard-view';
import {SignUpScreenProps} from '@/navigation/types';
import {useSignupUser} from '@/api/auth/post-signup';

type Props = SignUpScreenProps;

interface SignupData {
  username: string;
  email: string;
  password: string;
}

const SignUp: React.FC<Props> = ({navigation}) => {
  const [signupData, setSignupData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
  });
  const emailRef: MutableRefObject<TextInput | null> = useRef(null);
  const usernameRef: MutableRefObject<TextInput | null> = useRef(null);
  const passwordRef: MutableRefObject<TextInput | null> = useRef(null);

  const {
    mutate: signupUser,
    isPending,
    error,
  } = useSignupUser({
    onSuccess: data => {
      console.log('Signup Successful', data);
    },
    onError: error => {
      console.error('Signup Error: ', error);
    },
  });

  const handleChangeText = useCallback((name: string, text: string) => {
    setSignupData(prev => ({
      ...prev,
      [name]: text.trim(),
    }));
  }, []);

  const onSubmit: () => void = useCallback((): void => {
    const {email, username, password} = signupData;
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!username || !username.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }
    signupUser(signupData);
    // Alert.alert('알림', '회원가입 되었습니다.');
  }, [signupData, signupUser]);

  const canGoNext: boolean = Object.values(signupData).every(
    value => value !== '',
  );
  return (
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={(text: string) => handleChangeText('email', text)}
          placeholder="이메일을 입력해주세요"
          placeholderTextColor="#666"
          textContentType="emailAddress"
          value={signupData.email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => usernameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이름을 입력해주세요."
          placeholderTextColor="#666"
          onChangeText={(text: string) => handleChangeText('username', text)}
          value={signupData.username}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={usernameRef}
          onSubmitEditing={(): void | undefined => passwordRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
          placeholderTextColor="#666"
          onChangeText={(text: string) => handleChangeText('password', text)}
          value={signupData.password}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext} // !canGoNext || loading
          onPress={onSubmit}>
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonZone: {
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 100,
    height: 44,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
