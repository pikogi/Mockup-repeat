import { Document, Page, View, Text, Image, StyleSheet, Svg, Path } from '@react-pdf/renderer'

// Gift Icon as SVG component for react-pdf
// Using simplified paths for better compatibility with react-pdf
const GiftIcon = ({ color = '#ffffff', size = 16 }) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Bottom box - gift base */}
        <Path d="M 4 12 L 20 12 L 20 22 L 4 22 Z" stroke={color} strokeWidth={2} fill="none" />
        {/* Top box - gift lid */}
        <Path d="M 2 7 L 22 7 L 22 12 L 2 12 Z" stroke={color} strokeWidth={2} fill="none" />
        {/* Vertical ribbon line */}
        <Path d="M 12 7 L 12 22" stroke={color} strokeWidth={2} />
        {/* Left bow curve */}
        <Path d="M 12 7 Q 9 4 7.5 7" stroke={color} strokeWidth={2} fill="none" />
        <Path d="M 7.5 7 Q 9 2 12 2" stroke={color} strokeWidth={2} fill="none" />
        {/* Right bow curve */}
        <Path d="M 12 7 Q 15 4 16.5 7" stroke={color} strokeWidth={2} fill="none" />
        <Path d="M 16.5 7 Q 15 2 12 2" stroke={color} strokeWidth={2} fill="none" />
      </Svg>
    </View>
  )
}

// Classic Template
const ClassicTemplate = ({ title, subtitle, reward, accentColor, qrUrl, logoUrl }) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      position: 'relative',
    },
    topBar: {
      height: 8,
      backgroundColor: accentColor,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
      paddingVertical: 40,
    },
    logoCircle: {
      width: 90,
      height: 90,
      borderRadius: 16,
      backgroundColor: accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    logoInitial: {
      color: '#ffffff',
      fontSize: 42,
      fontWeight: 'bold',
    },
    logoImage: {
      width: 90,
      height: 90,
      borderRadius: 16,
      marginBottom: 30,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 12,
      textAlign: 'center',
    },
    titleUnderline: {
      width: 70,
      height: 5,
      backgroundColor: accentColor,
      borderRadius: 3,
      marginBottom: 40,
    },
    qrContainer: {
      padding: 20,
      backgroundColor: '#f8f8f8',
      borderRadius: 20,
      borderWidth: 3,
      borderColor: accentColor,
      borderStyle: 'solid',
      marginBottom: 30,
    },
    qrImage: {
      width: 180,
      height: 180,
    },
    subtitle: {
      fontSize: 18,
      color: '#666666',
      marginBottom: 24,
      textAlign: 'center',
    },
    rewardBadge: {
      backgroundColor: accentColor,
      paddingHorizontal: 28,
      paddingVertical: 14,
      borderRadius: 35,
      flexDirection: 'row',
      alignItems: 'center',
    },
    rewardText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    footer: {
      position: 'absolute',
      bottom: 35,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#999999',
    },
    footerBrand: {
      fontSize: 12,
      color: accentColor,
      fontWeight: 'bold',
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.topBar} />
      <View style={styles.content}>
        {logoUrl ? (
          <Image src={logoUrl} style={styles.logoImage} />
        ) : (
          <View style={styles.logoCircle}>
            <Text style={styles.logoInitial}>{title.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={styles.titleUnderline} />
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} src={qrUrl} />
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.rewardBadge}>
          <GiftIcon color="#ffffff" size={18} />
          <Text style={styles.rewardText}>{reward}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by </Text>
        <Text style={styles.footerBrand}>Repeat.la</Text>
      </View>
    </Page>
  )
}

// Minimal Template - With highlighted reward
const MinimalTemplate = ({ title, subtitle, reward, accentColor, qrUrl, logoUrl }) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      position: 'relative',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 50,
    },
    logo: {
      width: 55,
      height: 55,
      borderRadius: 14,
      backgroundColor: accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 35,
    },
    logoText: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    logoImage: {
      width: 55,
      height: 55,
      borderRadius: 14,
      marginBottom: 35,
    },
    qrContainer: {
      padding: 28,
      backgroundColor: '#ffffff',
      borderRadius: 28,
      borderWidth: 1,
      borderColor: '#eeeeee',
      marginBottom: 35,
    },
    qrImage: {
      width: 220,
      height: 220,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 14,
      textAlign: 'center',
    },
    subtitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: accentColor,
      marginHorizontal: 10,
    },
    subtitle: {
      fontSize: 15,
      color: '#888888',
    },
    rewardBadge: {
      backgroundColor: `${accentColor}15`,
      borderWidth: 2,
      borderColor: accentColor,
      borderStyle: 'solid',
      borderRadius: 20,
      paddingHorizontal: 32,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rewardText: {
      fontSize: 20,
      color: accentColor,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    footer: {
      position: 'absolute',
      bottom: 35,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#cccccc',
      fontWeight: 'bold',
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.content}>
        {logoUrl ? (
          <Image src={logoUrl} style={styles.logoImage} />
        ) : (
          <View style={styles.logo}>
            <Text style={styles.logoText}>{title.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} src={qrUrl} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.subtitleRow}>
          <View style={styles.dot} />
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.dot} />
        </View>
        <View style={styles.rewardBadge}>
          <GiftIcon color={accentColor} size={20} />
          <Text style={styles.rewardText}>{reward}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>repeat.la</Text>
      </View>
    </Page>
  )
}

// Promo Template
const PromoTemplate = ({ title, subtitle, reward, accentColor, qrUrl, logoUrl }) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      position: 'relative',
    },
    header: {
      backgroundColor: accentColor,
      paddingVertical: 35,
      paddingHorizontal: 30,
      alignItems: 'center',
    },
    rewardLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    rewardLabel: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.9)',
      letterSpacing: 1.5,
      marginLeft: 8,
    },
    rewardText: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 50,
      paddingTop: 40,
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      width: '100%',
    },
    logoBox: {
      width: 70,
      height: 70,
      borderRadius: 16,
      backgroundColor: `${accentColor}15`,
      borderWidth: 2,
      borderColor: `${accentColor}30`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
    },
    logoText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: accentColor,
    },
    logoImage: {
      width: 70,
      height: 70,
      borderRadius: 16,
      marginRight: 20,
    },
    titleContainer: {
      flexShrink: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#1a1a1a',
      marginBottom: 4,
      flexWrap: 'wrap',
      maxWidth: '100%',
      textAlign: 'center',
    },
    subLabel: {
      fontSize: 14,
      color: '#999999',
      textAlign: 'center',
    },
    qrContainer: {
      padding: 18,
      backgroundColor: '#f8f8f8',
      borderRadius: 18,
      borderWidth: 2,
      borderColor: accentColor,
      borderStyle: 'dashed',
      marginBottom: 35,
    },
    qrImage: {
      width: 160,
      height: 160,
    },
    cta: {
      backgroundColor: accentColor,
      paddingHorizontal: 50,
      paddingVertical: 18,
      borderRadius: 18,
    },
    ctaText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f8f8f8',
      paddingVertical: 18,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#999999',
    },
    footerBrand: {
      fontSize: 12,
      color: accentColor,
      fontWeight: 'bold',
    },
  })

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.rewardLabelRow}>
          <GiftIcon color="#ffffff" size={18} />
          <Text style={styles.rewardLabel}>RECOMPENSA</Text>
        </View>
        <Text style={styles.rewardText}>{reward}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.logoRow}>
          {logoUrl ? (
            <Image src={logoUrl} style={styles.logoImage} />
          ) : (
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>{title.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subLabel}>Club de Fidelidad</Text>
          </View>
        </View>
        <View style={styles.qrContainer}>
          <Image style={styles.qrImage} src={qrUrl} />
        </View>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by </Text>
        <Text style={styles.footerBrand}>Repeat.la</Text>
      </View>
    </Page>
  )
}

// Main FlyerPDF component
const FlyerPDF = ({ template, title, subtitle, reward, accentColor, qrUrl, logoUrl }) => {
  return (
    <Document>
      {template === 'classic' && (
        <ClassicTemplate
          title={title}
          subtitle={subtitle}
          reward={reward}
          accentColor={accentColor}
          qrUrl={qrUrl}
          logoUrl={logoUrl}
        />
      )}
      {template === 'minimal' && (
        <MinimalTemplate
          title={title}
          subtitle={subtitle}
          reward={reward}
          accentColor={accentColor}
          qrUrl={qrUrl}
          logoUrl={logoUrl}
        />
      )}
      {template === 'promo' && (
        <PromoTemplate
          title={title}
          subtitle={subtitle}
          reward={reward}
          accentColor={accentColor}
          qrUrl={qrUrl}
          logoUrl={logoUrl}
        />
      )}
    </Document>
  )
}

export default FlyerPDF
