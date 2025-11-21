import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ForgotPasswordScreen from './ForgotPasswordScreen';

// Web fallback icons using Unicode/Emoji
const WebIcon = ({ name, size, color, style }) => {
  if (Platform.OS !== 'web') {
    return <WebIcon name={name} size={size} color={color} style={style} />;
  }
  
  const iconMap = {
    'wallet': '💰',
    'person-outline': '👤',
    'lock-closed-outline': '🔒',
    'eye-outline': '👁',
    'eye-off-outline': '👁‍🗨',
    'alert-circle': '⚠️',
    'person-add': '➕',
    'close': '✕',
    'checkmark-circle': '✓',
    'person': '👤',
    'mail-outline': '📧',
    'call-outline': '📞',
    'checkmark': '✓',
  };
  
  return (
    <Text style={[{ fontSize: size * 0.8, color, lineHeight: size }, style]}>
      {iconMap[name] || '•'}
    </Text>
  );
};

const API_URL = 'https://money-manager-api-xr4v.onrender.com/api';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loginError, setLoginError] = useState('');

  // Registration form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const [focusedInput, setFocusedInput] = useState(null);

  const validatePassword = useCallback((pwd) => {
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[@$!%*?&#]/.test(pwd);
    const isLongEnough = pwd.length >= 5;

    return {
      isValid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    };
  }, []);

  const handleLogin = useCallback(async () => {
    setLoginError('');
    
    if (!username || !password) {
      setLoginError('Please enter both username and password');
      return;
    }

    if (username.length < 4) {
      setLoginError('Username must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data) {
        setLoginError('');
        await onLogin(response.data);
      }
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  }, [username, password, onLogin]);

  const handleClear = useCallback(() => {
    setUsername('');
    setPassword('');
    setLoginError('');
  }, []);

  const validateRegistrationForm = useCallback(() => {
    const newErrors = {};

    if (!regUsername || regUsername.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    const passwordValidation = validatePassword(regPassword);
    if (!regPassword || !passwordValidation.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    if (!regEmail || !/\S+@\S+\.\S+/.test(regEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!regPhone || regPhone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!regName) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [regUsername, regPassword, regEmail, regPhone, regName, validatePassword]);

  const handleRegister = useCallback(async () => {
    if (!validateRegistrationForm()) {
      return;
    }

    setRegistering(true);
    setRegisterError('');
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: regUsername,
        password: regPassword,
        email: regEmail,
        phoneNumber: regPhone,
        name: regName,
      });

      if (response.data.success) {
        setSuccessMessage('Account created successfully!');
        setUsername(regUsername);
        setRegisterError('');
        
        setTimeout(() => {
          setSuccessMessage('');
          setShowRegisterModal(false);
          handleClearRegister();
        }, 3000);
      }
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setRegistering(false);
    }
  }, [validateRegistrationForm, regUsername, regPassword, regEmail, regPhone, regName]);

  const handleClearRegister = useCallback(() => {
    setRegUsername('');
    setRegPassword('');
    setRegEmail('');
    setRegPhone('');
    setRegName('');
    setErrors({});
    setRegisterError('');
    setShowPasswordInfo(false);
  }, []);

  const handleCancelRegister = useCallback(() => {
    setShowRegisterModal(false);
    handleClearRegister();
  }, [handleClearRegister]);

  const passwordValidation = useMemo(
    () => (regPassword ? validatePassword(regPassword) : null),
    [regPassword, validatePassword]
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <WebIcon name="wallet" size={60} color="#2196F3" />
          <Text style={styles.appName}>Money Manager</Text>
        </View>
        <Text style={styles.tagline}>Manage Your Finances Wisely</Text>

        <View style={styles.form}>
          <View style={[styles.inputContainer, focusedInput === 'username' && styles.inputFocused]}>
            <WebIcon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
              onFocus={() => setFocusedInput('username')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={[styles.inputContainer, focusedInput === 'password' && styles.inputFocused]}>
            <WebIcon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={!loading}
              onFocus={() => setFocusedInput('password')}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <WebIcon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {loginError ? (
            <View style={styles.errorContainer}>
              <WebIcon name="alert-circle" size={18} color="#d32f2f" />
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
              disabled={loading}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={() => setShowForgotPassword(true)}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => setShowRegisterModal(true)}
            disabled={loading}
          >
            <Text style={styles.signupText}>Don't have an account? </Text>
            <Text style={styles.signupTextBold}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showForgotPassword}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <ForgotPasswordScreen
          onBack={() => setShowForgotPassword(false)}
          onSuccess={(message) => {
            setShowForgotPassword(false);
            Alert.alert('Success', message);
          }}
        />
      </Modal>

      <Modal
        visible={showRegisterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelRegister}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Account</Text>
                <TouchableOpacity onPress={handleCancelRegister}>
                  <WebIcon name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>

              {successMessage && (
                <View style={styles.successMessageContainer}>
                  <WebIcon name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.successMessageText}>{successMessage}</Text>
                </View>
              )}

              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                {errors.name && <Text style={styles.fieldErrorText}>{errors.name}</Text>}
                <View style={[styles.inputContainer, focusedInput === 'regName' && styles.inputFocused, errors.name && styles.inputError]}>
                  <WebIcon name="person" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={regName}
                    onChangeText={setRegName}
                    editable={!registering}
                    onFocus={() => setFocusedInput('regName')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {errors.username && <Text style={styles.fieldErrorText}>{errors.username}</Text>}
                <View style={[styles.inputContainer, focusedInput === 'regUsername' && styles.inputFocused, errors.username && styles.inputError]}>
                  <WebIcon name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username (min 4 characters)"
                    value={regUsername}
                    onChangeText={setRegUsername}
                    autoCapitalize="none"
                    editable={!registering}
                    onFocus={() => setFocusedInput('regUsername')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                <View>
                  {errors.password && <Text style={styles.fieldErrorText}>{errors.password}</Text>}
                  <View style={[styles.inputContainer, focusedInput === 'regPassword' && styles.inputFocused, errors.password && styles.inputError]}>
                    <WebIcon name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={regPassword}
                      onChangeText={setRegPassword}
                      secureTextEntry={!showRegPassword}
                      autoCapitalize="none"
                      editable={!registering}
                      onFocus={() => setFocusedInput('regPassword')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPasswordInfo(!showPasswordInfo)}
                      style={styles.infoIcon}
                    >
                      <WebIcon
                        name="information-circle-outline"
                        size={22}
                        color="#2196F3"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setShowRegPassword(!showRegPassword)}
                      style={styles.eyeIcon}
                    >
                      <WebIcon
                        name={showRegPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {showPasswordInfo && (
                    <View style={styles.passwordRequirements}>
                      <Text style={styles.requirementsTitle}>Password must contain:</Text>
                      <PasswordRequirement
                        met={passwordValidation?.hasUpperCase || false}
                        text="At least one uppercase letter"
                      />
                      <PasswordRequirement
                        met={passwordValidation?.hasLowerCase || false}
                        text="At least one lowercase letter"
                      />
                      <PasswordRequirement
                        met={passwordValidation?.hasNumber || false}
                        text="At least one number"
                      />
                      <PasswordRequirement
                        met={passwordValidation?.hasSpecialChar || false}
                        text="At least one special character (@$!%*?&#)"
                      />
                      <PasswordRequirement
                        met={passwordValidation?.isLongEnough || false}
                        text="At least 5 characters"
                      />
                    </View>
                  )}
                </View>

                {errors.email && <Text style={styles.fieldErrorText}>{errors.email}</Text>}
                <View style={[styles.inputContainer, focusedInput === 'regEmail' && styles.inputFocused, errors.email && styles.inputError]}>
                  <WebIcon name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={regEmail}
                    onChangeText={setRegEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!registering}
                    onFocus={() => setFocusedInput('regEmail')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {errors.phone && <Text style={styles.fieldErrorText}>{errors.phone}</Text>}
                <View style={[styles.inputContainer, focusedInput === 'regPhone' && styles.inputFocused, errors.phone && styles.inputError]}>
                  <WebIcon name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    value={regPhone}
                    onChangeText={setRegPhone}
                    keyboardType="phone-pad"
                    editable={!registering}
                    onFocus={() => setFocusedInput('regPhone')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>

                {registerError ? (
                  <View style={styles.errorContainer}>
                    <WebIcon name="alert-circle" size={18} color="#d32f2f" />
                    <Text style={styles.errorText}>{registerError}</Text>
                  </View>
                ) : null}

                <View style={styles.modalButtonRow}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={handleRegister}
                    disabled={registering}
                  >
                    {registering ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.modalButtonText}>Submit</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleClearRegister}
                    disabled={registering}
                  >
                    <Text style={styles.cancelButtonText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const PasswordRequirement = ({ met, text }) => (
  <View style={styles.requirementRow}>
    <WebIcon
      name={met ? 'checkmark-circle' : 'close-circle'}
      size={16}
      color={met ? '#4CAF50' : '#F44336'}
    />
    <Text style={[styles.requirementText, met && styles.requirementMet]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: -50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginBottom: 35,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    transition: 'all 0.3s ease',
  },
  inputFocused: {
    borderColor: '#2196F3',
    borderWidth: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    outlineStyle: 'none',
  },
  eyeIcon: {
    padding: 5,
  },
  infoIcon: {
    padding: 5,
    marginRight: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    marginTop: 15,
    alignItems: 'center',
    padding: 10,
  },
  forgotPasswordText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  signupButton: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupTextBold: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupIcon: {
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    maxHeight: 500,
  },
  passwordRequirements: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  fieldErrorText: {
    color: '#d32f2f',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
    marginLeft: 5,
  },
  inputError: {
    borderColor: '#d32f2f',
    borderWidth: 2,
    backgroundColor: '#FFF5F5',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  successMessageText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
});
