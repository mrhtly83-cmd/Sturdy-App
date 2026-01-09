import { StyleSheet, View, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Video Background Placeholder - Use a dark gradient for now */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200' }}
        style={styles.backgroundImage}
        blurRadius={0}
      >
        {/* Dark overlay for readability */}
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
          style={styles.overlay}
        />
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        
        {/* Top Bar with Glassmorphism */}
        <BlurView intensity={40} tint="dark" style={styles.topBar}>
          <View style={styles.topBarContent}>
            <View style={styles.logo}>
              <LinearGradient
                colors={['#F87171', '#F97316']}
                style={styles.logoGradient}
              >
                <Text style={styles.logoIcon}>✓</Text>
              </LinearGradient>
              <Text style={styles.logoText}>STURDY</Text>
            </View>
            
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signupButton}>
                <LinearGradient
                  colors={['#F87171', '#F97316']}
                  style={styles.signupGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupButtonText}>Sign Up</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        {/* Hero Content */}
        <View style={styles.heroContent}>
          {/* Badge */}
          <BlurView intensity={40} tint="dark" style={styles.badge}>
            <Text style={styles.badgeIcon}>⭐</Text>
            <Text style={styles.badgeText}>Trusted by 10,000+ parents</Text>
          </BlurView>

          {/* Headline */}
          <Text style={styles.headline}>
            Calm words,{'\n'}on demand
          </Text>

          {/* Subheadline */}
          <Text style={styles.subheadline}>
            Science-backed parenting scripts when you need them most.
          </Text>

          {/* CTA Buttons */}
          <View style={styles.ctaContainer}>
            <TouchableOpacity style={styles.primaryCta}>
              <LinearGradient
                colors={['#F87171', '#F97316']}
                style={styles.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryCtaText}>Get Started Free</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity>
              <BlurView intensity={40} tint="dark" style={styles.secondaryCta}>
                <Text style={styles.secondaryCtaText}>See Pricing</Text>
              </BlurView>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustContainer}>
            <Text style={styles.trustText}>✓ Free 7-day trial • No credit card required</Text>
          </View>

          {/* Social Proof */}
          <BlurView intensity={40} tint="dark" style={styles.socialProof}>
            <Text style={styles.starsText}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.ratingText}>4.9/5</Text>
            <Text style={styles.reviewsText}>(2,000+ reviews)</Text>
          </BlurView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.7,
  },
  overlay: {
    position: 'absolute',
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  topBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  signupGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  badgeIcon: {
    fontSize: 16,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headline: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 56,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subheadline: {
    color: '#F3F4F6',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  ctaContainer: {
    width: '100%',
    gap: 12,
    paddingTop: 16,
  },
  primaryCta: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  primaryGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryCta: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  secondaryCtaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trustContainer: {
    marginTop: 8,
  },
  trustText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
    marginTop: 8,
  },
  starsText: {
    fontSize: 16,
  },
  ratingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewsText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
});
