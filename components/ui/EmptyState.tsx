import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Typography } from './Typography';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      
      <Typography
        variant="h4"
        color="primary"
        align="center"
        style={styles.title}>
        {title}
      </Typography>
      
      {description && (
        <Typography
          variant="body1"
          color="secondary"
          align="center"
          style={styles.description}>
          {description}
        </Typography>
      )}
      
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  icon: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 32,
    lineHeight: 24,
  },
  action: {
    minWidth: 160,
  },
});